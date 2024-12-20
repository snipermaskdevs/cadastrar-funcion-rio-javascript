const fs = require('fs');
const prompt = require('prompt-sync')();

const funcionárioFilePath = 'funcionário.json';

// Função para carregar dados do arquivo JSON
function loadFuncionário() {
    if (!fs.existsSync(funcionárioFilePath)) {
        fs.writeFileSync(funcionárioFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(funcionárioFilePath);
    return JSON.parse(data);
}

// Função para salvar dados no arquivo JSON
function saveFuncionário(funcionárioList) {
    fs.writeFileSync(funcionárioFilePath, JSON.stringify(funcionárioList, null, 2));
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

// Função para validar e-mail
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função para cadastrar um novo funcionário
function cadastrarFuncionário() {
    const funcionárioList = loadFuncionário();

    console.log('\n--- Cadastrar Novo Funcionário ---');
    const nome = prompt('Nome: ');
    const funcao = prompt('Função: ');
    const email = prompt('Email: ');
    const cpf = prompt('CPF: ');
    const telefone = prompt('Telefone: ');
    const dataContratacao = prompt('Data de Contratação (DD/MM/AAAA): ');
    const salario = parseFloat(prompt('Salário: '));
    const departamento = prompt('Departamento: ');

    if (!nome || !funcao || !validarEmail(email) || !validarCPF(cpf) || isNaN(salario)) {
        console.log('⚠️ Erro: Dados inválidos! Verifique o CPF, e-mail e salário.');
        return;
    }

    const novoFuncionário = {
        id: funcionárioList.length + 1,
        nome,
        funcao,
        email,
        cpf,
        telefone,
        dataContratacao,
        salario,
        departamento,
        dataRegistro: new Date().toLocaleString()
    };

    funcionárioList.push(novoFuncionário);
    saveFuncionário(funcionárioList);
    console.log('✅ Funcionário cadastrado com sucesso!');
}

// Função para excluir um funcionário
function excluirFuncionário() {
    const funcionárioList = loadFuncionário();

    console.log('\n--- Excluir Funcionário ---');
    const id = parseInt(prompt('Digite o ID do funcionário a ser excluído: '));

    const índice = funcionárioList.findIndex(funcionário => funcionário.id === id);
    if (índice === -1) {
        console.log('⚠️ Funcionário não encontrado.');
        return;
    }

    const funcionário = funcionárioList[índice];
    console.log(`Funcionário encontrado: ${funcionário.nome} (${funcionário.id})`);

    const confirmar = prompt(`Tem certeza que deseja excluir o funcionário ${funcionário.nome}? (s/n): `).toLowerCase();
    if (confirmar === 's') {
        funcionárioList.splice(índice, 1);
        saveFuncionário(funcionárioList);
        console.log('✅ Funcionário excluído com sucesso!');
    } else {
        console.log('Exclusão cancelada.');
    }
}

// Função para editar um funcionário
function editarFuncionário() {
    const funcionárioList = loadFuncionário();

    console.log('\n--- Editar Funcionário ---');
    const id = parseInt(prompt('Digite o ID do funcionário a ser editado: '));

    const índice = funcionárioList.findIndex(funcionário => funcionário.id === id);
    if (índice === -1) {
        console.log('⚠️ Funcionário não encontrado.');
        return;
    }

    const funcionário = funcionárioList[índice];
    console.log(`Funcionário encontrado: ${funcionário.nome} (${funcionário.id})`);

    const nome = prompt(`Nome (atual: ${funcionário.nome}): `) || funcionário.nome;
    const funcao = prompt(`Função (atual: ${funcionário.funcao}): `) || funcionário.funcao;
    const email = prompt(`Email (atual: ${funcionário.email}): `) || funcionário.email;
    const cpf = prompt(`CPF (atual: ${funcionário.cpf}): `) || funcionário.cpf;
    const telefone = prompt(`Telefone (atual: ${funcionário.telefone}): `) || funcionário.telefone;
    const dataContratacao = prompt(`Data de Contratação (atual: ${funcionário.dataContratacao}): `) || funcionário.dataContratacao;
    const salario = parseFloat(prompt(`Salário (atual: ${funcionário.salario}): `)) || funcionário.salario;
    const departamento = prompt(`Departamento (atual: ${funcionário.departamento}): `) || funcionário.departamento;

    if (!validarEmail(email) || !validarCPF(cpf) || isNaN(salario)) {
        console.log('⚠️ Erro: Dados inválidos! Verifique o CPF, e-mail e salário.');
        return;
    }

    funcionárioList[índice] = {
        ...funcionárioList[índice],
        nome,
        funcao,
        email,
        cpf,
        telefone,
        dataContratacao,
        salario,
        departamento,
        dataRegistro: new Date().toLocaleString()
    };

    saveFuncionário(funcionárioList);
    console.log('✅ Funcionário editado com sucesso!');
}

// Função para mostrar a lista de funcionários com opções avançadas
function mostrarListaFuncionárioAvancada() {
    const funcionárioList = loadFuncionário();

    console.log('\n--- Lista de Funcionários (Avançada) ---');
    if (funcionárioList.length === 0) {
        console.log('Nenhum Funcionário cadastrado.');
        return;
    }

    const filtro = prompt('Filtrar por departamento (ou pressione Enter para ignorar): ');
    let listaFiltrada = funcionárioList;

    if (filtro) {
        listaFiltrada = funcionárioList.filter(funcionário => 
            funcionário.departamento.toLowerCase().includes(filtro.toLowerCase())
        );
        if (listaFiltrada.length === 0) {
            console.log(`Nenhum funcionário encontrado no departamento "${filtro}".`);
            return;
        }
    }

    const colunaOrdenacao = prompt('Ordenar por (nome/salario/dataContratacao): ').toLowerCase();
    const ordenacaoValida = ['nome', 'salario', 'dataContratacao'];
    if (ordenacaoValida.includes(colunaOrdenacao)) {
        listaFiltrada.sort((a, b) => {
            if (colunaOrdenacao === 'salario') {
                return a.salario - b.salario;
            } else if (colunaOrdenacao === 'dataContratacao') {
                return new Date(a.dataContratacao) - new Date(b.dataContratacao);
            } else {
                return a.nome.localeCompare(b.nome);
            }
        });
    }

    const porPagina = parseInt(prompt('Quantos registros por página? (padrão: 5): ')) || 5;
    let paginaAtual = 1;
    const totalPaginas = Math.ceil(listaFiltrada.length / porPagina);

    while (true) {
        console.log(`\n--- Página ${paginaAtual}/${totalPaginas} ---`);
        console.log('ID | Nome     | Função  | Email              | CPF        | Tel       | Salário | Dep.     | Data');
        console.log('-------------------------------------------------------------------------------------------------');
    
        const inicio = (paginaAtual - 1) * porPagina;
        const fim = inicio + porPagina;
    
        listaFiltrada.slice(inicio, fim).forEach(funcionário => {
            console.log(
                `${funcionário.id.toString().padStart(2, ' ')} | ${funcionário.nome.padEnd(10, ' ')} | ${funcionário.funcao.padEnd(7, ' ')} | ${funcionário.email.padEnd(18, ' ')} | ${funcionário.cpf} | ${funcionário.telefone} | ${funcionário.salario.toFixed(2)} | ${funcionário.departamento} | ${funcionário.dataContratacao}`
            );
        });

        if (paginaAtual < totalPaginas) {
            const proximaPagina = prompt('Pressione Enter para próxima página, ou "s" para sair: ').toLowerCase();
            if (proximaPagina === 's') break;
            paginaAtual++;
        } else {
            break;
        }
    }
}

// Função para exibir os créditos
function exibirCreditos() {
    console.log("\n🌟 === Créditos === 🌟");
    console.log("👤 Desenvolvedor: snipermaskdev");
    console.log("🤝 Colaboradores: Nenhum");
    console.log("🛠️ Projeto: Sistema de Cadastro e Gestão de Funcionário");
    console.log("✨ Funcionalidades:");
    console.log("   ✅ Cadastro de novos funcionários com validações de CPF, e-mail e data.");
    console.log("   ✏️ Edição e exclusão de funcionários com histórico atualizado.");
    console.log("   🔍 Busca avançada por múltiplos critérios (nome, função, departamento, etc...).");
    console.log("   📋 Lista ordenada e exibida de forma clara e organizada.");
    console.log("   🗂️ Registro automático de ações em logs para auditoria.");
    console.log("🚀 Este sistema foi projetado para ser flexível, eficiente e confiável.");
    console.log("📅 Última atualização: 19/12/2024");
    console.log("📢 Obrigado por utilizar o sistema! 💼");
    console.log("🔧 Versão: 1.0");
}

// Função de menu principal
function menuPrincipal() {
    while (true) {
        console.log('\n--- Menu Principal ---');
        console.log('1. Cadastrar Funcionário');
        console.log('2. Excluir Funcionário');
        console.log('3. Editar Funcionário');
        console.log('4. Mostrar Lista de Funcionários');
        console.log('5. Mostrar Lista de Funcionários Avançada');
        console.log('6. Créditos');
        console.log('7. Sair');
        
        const opcao = prompt('Escolha uma opção: ');

        if (opcao === '1') {
            cadastrarFuncionário();
        } else if (opcao === '2') {
            excluirFuncionário();
        } else if (opcao === '3') {
            editarFuncionário();
        } else if (opcao === '4') {
            mostrarListaFuncionário();
        } else if (opcao === '5') {
            mostrarListaFuncionárioAvancada();
        } else if (opcao === '6') {
            exibirCreditos();
        } else if (opcao === '7') {
            console.log('Saindo...');
            break;
        } else {
            console.log('Opção inválida, tente novamente.');
        }
    }
}

// Iniciar o menu principal
menuPrincipal();