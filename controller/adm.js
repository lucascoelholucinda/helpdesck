import operacoes from './operacoes.js'
import moment from 'moment'
import cloudinary from '../utils/cloudinary.js'
/* VARIAVEIS GLOBAIS SENDO UTILIZADA EM MAIS DE UM METODO */
let usuarionosistema = [];
let produto = [];
let listaDeClientes = [];
let chamadosFuncionario = [];
let listagemDeChamados = [];
let statusFuncionario = [];
let recebernomedofuncionario;
/* VARIAVEIS GLOBAIS SENDO UTILIZADA EM MAIS DE UM METODO */


// PAGINA INICIAL DO SISTEMA HELPDESCK
const inicializacao = (req, res) => { try { res.render('adm/index') } catch (erro) { console.log("Erro Ao Tentar Inicializar A Pagina Inicial:" + erro) } }
// PAGINA INICIAL DO SISTEMA HELPDESCK

// PAGINA DE CADASTRO DE USUARIO NO SISTEMA HELPDESCK
const paginaCadastro = (req, res) => { try { res.render('adm/cadastrar') } catch (erro) { console.log("Erro Ao Tentar Inicializar A Pagina De Cadastro: " + erro) } }
// PAGINA DE CADASTRO DE USUARIO NO SISTEMA HELPDESCK

// METODO DE FORMULARIO DE CADASTRO NO SISTEMA HELPDESCK
const realizarCadastroDeUsuario = async (req, res) => { try { if (await operacoes.validacaoTexto(req.body.login)) { let login = await operacoes.correcaoDeVariavel(req.body.login); let nome = await operacoes.correcaoDeVariavel(req.body.Nome); let cargo = await operacoes.correcaoDeVariavel(req.body.Cargo); let processo = await operacoes.validarcadastroUsuario(login, req.body.senha, nome, cargo); if (processo == true) { req.flash("success_msg", "Usuario Cadastrado Com Sucesso"); return res.redirect("/cadastrar") } else { req.flash("erro_msg", "Erro! Nome de Funcionario,Login ou Senha Já São Existentes No Sistema,Por favor Preencha Novamente Os Campos"); return res.redirect("/cadastrar") } }; req.flash("aviso_msg", "Aviso, Usuario Não Pode Ser Cadastrado!O Campo De Login Apenas Aceita Letras,Por Favor,Evite Digitar Numeros e Tente Novamente."); return res.redirect("/cadastrar") } catch (erro) { console.log("Erro Ao Tentar Realizar Cadastro De Usuario: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Cadastro De Usuario!"); return res.redirect("/cadastrar") } }
// METODO DE FORMULARIO DE CADASTRO NO SISTEMA HELPDESCK

// METODO DE LOGIN NO SISTEMA HELPDESK
const Login = async (req, res) => { try { let login = await operacoes.correcaoDeVariavel(req.query.login); let passou = await operacoes.validarEntradaDeUsuario(login, req.query.senha); if (passou == false) { return res.redirect("/home") }; req.flash("erro_msg", "Login Invalido! Por Favor, Redigite Seu Login e Senha Novamente"); return res.redirect("/") } catch (erro) { console.log("Erro Ao Realizar Login No Sistema: " + erro); return res.redirect("/") } }
// METODO DE LOGIN NO SISTEMA HELPDESK


// PAGINA DE VISUALIZAÇÃO APÓS O LOGIN NO SISTEMA HELPDDESCK
const paginaInicial = async (req, res) => { try { let entrandoFuncionarios = await operacoes.carregandoNomeUsuario(); if (entrandoFuncionarios != undefined || entrandoFuncionarios != null || entrandoFuncionarios != "") { usuarionosistema = entrandoFuncionarios; entrandoFuncionarios = []; return res.render('adm/home', { funcionarioentrando: usuarionosistema }) } if (entrandoFuncionarios.length >= 1) { usuarionosistema = entrandoFuncionarios; entrandoFuncionarios = []; return res.render('adm/home', { funcionarioentrando: usuarionosistema }) } req.flash("erro_msg", "Erro! Funcionario Não Existente No Sistema"); return res.redirect('/') } catch (erro) { console.log("Erro Ao Inicializar Pagina Inicial: " + erro); req.flash("aviso_msg", "Erro Ao Inicializar Pagina Inicial!"); return res.redirect('/') } }
// PAGINA DE VISUALIZAÇÃO APÓS O LOGIN NO SISTEMA HELPDDESCK


// PAGINA DE VISUALIZAÇÃO PARA CADASTRAR UM CHAMADO NO SISTEMA HELPDESCK
const paginadeChamados = async (req, res) => { if (usuarionosistema.length != 0) { try { let funcionarios = await operacoes.listandoFuncionarios(); return res.render('adm/chamados', { Funcionarios: funcionarios, funcionarioentrando: usuarionosistema }) } catch (erro) { console.log("Erro Ao Tentar Inicializar Pagina De Chamados:" + erro); req.flash("aviso_msg", "Erro Ao Tentar Inicializar Pagina De Chamados!"); return res.redirect("/home") } } return res.redirect("/") }
// PAGINA DE VISUALIZAÇÃO PARA CADASTRAR UM CHAMADO NO SISTEMA HELPDESCK


// METODO PARA CADASTRAR UM CHAMADO NO SISTEMA HELPDESCK
const cadastrarChamado = async (req, res) => {
    try {
        let validacaoProduto = await operacoes.validacaoTexto(await operacoes.correcaoDeVariavel(req.body.Produto))
        let validacaoRepresentante = await operacoes.validacaoTexto(await operacoes.correcaoDeVariavel(req.body.Representante))
        if (validacaoProduto == true && validacaoRepresentante == true) {
            if (req.body.Telefone.length == 15) {
                let validacaoDeEmail = await operacoes.validacaoDeEmail(await operacoes.correcaoDeVariavel(req.body.Email),)
                if (validacaoDeEmail == true) {
                    let dataselecionada = await operacoes.listandoDatas(req.body.Tempoestimado)
                    if (moment(new Date(req.body.Tempoestimado)).add(1, 'day').format("YYYY/MM/DD") >= moment(new Date()).format("YYYY/MM/DD")) {
                        if (dataselecionada != undefined && dataselecionada != null && dataselecionada != "") {
                            if (dataselecionada.Nomedofuncionario == req.body.Nomedofuncionario && moment(new Date(dataselecionada.Tempoestimado)).add(1, 'day').format("YYYY-MM-DD") == req.body.Tempoestimado) {
                                req.flash("aviso_msg", "Aviso! Esse Funcionario Já Possui Um Chamado Marcado Para Essa Data, Por favor Escolha Outra Data, Para Encaminhar O Chamado!"); return res.redirect("/chamados")
                            }
                        }
                        if (req.file) {
                            let novochamado = {
                                Produto: await operacoes.correcaoDeVariavel(req.body.Produto),
                                Valor: req.body.Valor,
                                Quantidade: req.body.Quantidade,
                                Processo: req.body.Processo,
                                Setor: req.body.Setor,
                                Destinatario: req.body.Destinatario,
                                Procedimento: req.body.Procedimento,
                                Empresa: req.body.Empresa,
                                Representante: req.body.Representante,
                                Telefone: req.body.Telefone,
                                Email: await operacoes.correcaoDeVariavel(req.body.Email),
                                Titulo: await operacoes.correcaoDeVariavel(req.body.Titulo),
                                Descricao: await operacoes.correcaoDeVariavel(req.body.Descricao),
                                Manutencao: req.body.Manutencao,
                                Status: req.body.Status,
                                Tempoestimado: req.body.Tempoestimado,
                                Criadordochamado: req.body.Criadordochamado,
                                Nomedofuncionario: req.body.Nomedofuncionario,
                                Foto: req.file.path
                            }
                            let novoproduto = {
                                NomedoProduto: novochamado.Produto,
                                Foto: req.file.path,
                                Valor: novochamado.Valor,
                                Quantidade: novochamado.Quantidade,
                                Cadastrador: novochamado.Criadordochamado
                            }

                            let chamadocriado = await operacoes.realizarCadastroDeChamados(novochamado)
                            if (chamadocriado != undefined && chamadocriado != null && chamadocriado != "") {
                                operacoes.realizarCadastroDeProdutos(novoproduto)
                                req.flash("success_msg", "Chamado Criado Com Sucesso")
                                return res.redirect('/chamados')
                            }
                            req.flash("aviso_msg", "Erro!Houve Um Problema Ao Tentar Cadastrar Chamado")
                            return res.redirect("/chamados")
                        }
                        req.flash("erro_msg", "Erro, Chamado Não Cadastrado! O Formato de Imagem Escolhido, Não é Aceito Por Esse Sistema!Formatos Aceitos São: PNG,JPG e JPEG.")
                        return res.redirect("/chamados")
                    }
                    req.flash("aviso_msg", "Aviso Data Invalida!O Sistema não Aceita Data Que Seja Antecessoras a Data Atual,Por favor, Selecione Outra Data.")
                    return res.redirect("/chamados")
                }
                req.flash("aviso_msg", "Aviso Email Invalido! Por Favor, Certifique-se De Apresentar Um E-mail Valido.Ex: ******@gmail.com")
                return res.redirect("/chamados")
            }
            req.flash("aviso_msg", "Aviso Telefone Invalido! Por Favor, Certifique-se De Apresentar Um Telefone Valido.Ex: (48)89127-3456.")
            return res.redirect("/chamados")
        }
        req.flash("aviso_msg", "Aviso,Chamando Não pode Ser Realizado! Os Campos Produto e Representante,Somente Aceitam letras!Por favor, Evitar Digitar Numeros.")
        return res.redirect("/chamados")

    } catch (erro) { console.log("Erro Ao Tentar Cadastrar Chamado No Sistema: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Cadastrar Chamado No Sistema!"); return res.redirect("/chamados") }
}
// METODO PARA CADASTRAR UM CHAMADO NO SISTEMA HELPDESCK

// PAGINA DE LISTAGEM DE CHAMADOS NO SISTEMA HELPDESCK
const paginaDeListagemDeChamados = async (req, res) => { if (usuarionosistema.length != 0) { try { let emespera = await operacoes.contagemDeChamadosEmEspera(); let emprocesso = await operacoes.contagemDeChamadosEmProcesso(); let listadechadosemespera = await operacoes.listandoChamadosEmEspera(); let listadechadosemeprocesso = await operacoes.listandoChamadosEmProcesso(); if (listagemDeChamados != null && listagemDeChamados != "" && listagemDeChamados != undefined) { let novalista = listagemDeChamados; listagemDeChamados = []; return res.render('adm/listadechamados', { emespera: emespera, emprocesso: emprocesso, listadechadosemespera: listadechadosemespera, listadechadosemeprocesso: listadechadosemeprocesso, funcionarioentrando: usuarionosistema, listadechamadospesquisados: novalista }) } return res.render('adm/listadechamados', { emespera: emespera, emprocesso: emprocesso, listadechadosemespera: listadechadosemespera, listadechadosemeprocesso: listadechadosemeprocesso, funcionarioentrando: usuarionosistema }) } catch (erro) { console.log("Erro Ao Inicializar Pagina De Listagem De Chamados: " + erro); req.flash("aviso_msg", "Erro Ao Inicializar Pagina De Listagem De Chamados!"); return res.redirect('/home') } } return res.redirect("/") }
// PAGINA DE LISTAGEM DE CHAMADOS NO SISTEMA HELPDESCK

// METODO DE LISTAGEM DE CHAMADOS NO SISTEMA HELPDESCK
const buscarListagemDeChamados = async (req, res) => {
    try {
        let chamadoslistagem; let contador = 0; if (req.query.chamado != undefined && req.query.chamado != null && req.query.chamado != "") {
            let pesquisadelistagem = await operacoes.correcaoDeVariavel(req.query.chamado); chamadoslistagem = await operacoes.buscandoTitulo(pesquisadelistagem); if (chamadoslistagem.length >= 1) { while (contador != chamadoslistagem.length) { listagemDeChamados.push(chamadoslistagem[contador]); contador++ }; return res.redirect("/listadechamados") }; chamadoslistagem = await operacoes.buscandoDescricao(pesquisadelistagem); if (chamadoslistagem.length >= 1) { while (contador != chamadoslistagem.length) { listagemDeChamados.push(chamadoslistagem[contador]); contador++ }; return res.redirect("/listadechamados") }; chamadoslistagem = await operacoes.buscandoManutencao(pesquisadelistagem)
            if (chamadoslistagem.length >= 1) { while (contador != chamadoslistagem.length) { listagemDeChamados.push(chamadoslistagem[contador]); contador++ } return res.redirect("/listadechamados") } chamadoslistagem = await operacoes.buscandoStatus(pesquisadelistagem)
            if (chamadoslistagem.length >= 1) { while (contador != chamadoslistagem.length) { listagemDeChamados.push(chamadoslistagem[contador]); contador++ } return res.redirect("/listadechamados") }
        } else { chamadoslistagem = await operacoes.buscandoTempo(req.query.Data); if (chamadoslistagem.length >= 1) { while (contador != chamadoslistagem.length) { listagemDeChamados.push(chamadoslistagem[contador]); contador++ } return res.redirect("/listadechamados") }; req.flash("erro_msg", "Chamado(s) Não Encontrado(s)!Determinado Chamado Não está Cadastrado Com A Data Apresentada!"); return res.redirect('/listadechamados') } req.flash("erro_msg", "Chamado(s) Não Encontrado(s)!Determinado Chamado Não Está Cadastrado Com O Titulo,Descrição Ou Status Apresentado!"); return res.redirect('/listadechamados')
    } catch (erro) { console.log("Erro Ao Tentar Buscar Listagem De Chamados: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Buscar Listagem De Chamados!"); return res.redirect('/home') }
}
// METODO DE LISTAGEM DE CHAMADOS NO SISTEMA HELPDESCK


// PAGINA DE LISTAMGEM DE PRODUTOS NO SISTEMA HELPDESCK
const paginaDeListagemDeProdutos = async (req, res) => { if (usuarionosistema.length != 0) { try { let recebernome = produto.map((e) => { return e.Cadastrador; }); let fucionarionarioencontrado = await operacoes.listandoFuncionariosSelecionados(recebernome); let receberiddousuario = fucionarionarioencontrado.map((e) => { return e.Usuario; }); let senhadousuario = await operacoes.buscandoUsuarioId(receberiddousuario); let produtos = await operacoes.listandoProdutos(); if (produto != null && produto != "" && produto != undefined) { let novoproduto = produto; produto = []; return res.render("adm/listadeprodutos", { produtos: produtos, funcionarioentrando: usuarionosistema, chavedeFuncionario: senhadousuario, pesquisadeprodutos: novoproduto }) } else { return res.render("adm/listadeprodutos", { produtos: produtos, funcionarioentrando: usuarionosistema }) } } catch (erro) { console.log("Erro Ao Tentar Realizar Pagina De Listagem De Produtos: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Inicializar Pagina De Listagem De Produtos"); return res.redirect('/home') } } return res.redirect("/") }
// PAGINA DE LISTAMGEM DE PRODUTOS NO SISTEMA HELPDESCK

// METODO DE BUSCAR PRODUTOS NO SISTEMA HELPDESCK
const buscarproduto = async (req, res) => { try { let produtos; if (req.query.pesquisa != "" && req.query.pesquisa != undefined && req.query.pesquisa != null) { let pesquisa = await operacoes.correcaoDeVariavel(req.query.pesquisa); produtos = await operacoes.buscandoProdutosPorNome(pesquisa); if (produtos != "" && produtos != undefined && produtos != null) { produto.push(produtos); return res.redirect("/listadeprodutos") } produtos = await operacoes.buscandoProdutosPorCadastrador(pesquisa); if (produtos != "" && produtos != undefined && produtos != null) { produto.push(produtos); return res.redirect("/listadeprodutos") } req.flash("erro_msg", "Produto Não Encontrado Com Determinado Nome ou Cadastrador No Sistema!"); return res.redirect("/listadeprodutos") } else { produtos = await operacoes.buscandoProdutosPorValor(req.query.valor); if (produtos != "" && produtos != undefined && produtos != null) { produto.push(produtos); return res.redirect("/listadeprodutos") } req.flash("erro_msg", "Produto Não Encontrado Com Determinado Valor No Sistema!"); return res.redirect("/listadeprodutos") } } catch (erro) { console.log("Erro Ao Tentar Buscar Produto: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Buscar Produto!"); return res.redirect('/home') } }
// METODO DE BUSCAR PRODUTOS NO SISTEMA HELPDESCK


// PAGINA DE LISTAGEM DE CLIENTES NO SISTEMA HELPDESK
const paginaDeListagemDeClientes = async (req, res) => { if (usuarionosistema.length != 0) { try { let Clientes = await operacoes.listandoChamados(); if (listaDeClientes != null && listaDeClientes != "" && listaDeClientes != undefined) { let novocliente = listaDeClientes; listaDeClientes = []; return res.render("adm/listadeclientes", { Clientes: Clientes, funcionarioentrando: usuarionosistema, pesquisadeclientes: novocliente }) } return res.render("adm/listadeclientes", { Clientes: Clientes, funcionarioentrando: usuarionosistema }) } catch (erro) { console.log("Erro Ao Tentar Inicializar Pagina De Listagem De Clientes: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Pagina De Listagem De Clientes!"); return res.redirect('/home') } } return res.redirect("/") }
// PAGINA DE LISTAGEM DE CLIENTES NO SISTEMA HELPDESK

// METODO DE BUSCA DE ClIENTES NO SISTEMA HELPDESCK
const buscarcliente = async (req, res) => { try { let pesquisarcliente; let contador = 0; if (req.query.cliente != undefined && req.query.cliente != "" && req.query.cliente != null) { let pesquisadecliente = await operacoes.correcaoDeVariavel(req.query.cliente); pesquisarcliente = await operacoes.buscandoEmpresas(pesquisadecliente); if (pesquisarcliente.length >= 1) { while (contador != pesquisarcliente.length) { listaDeClientes.push(pesquisarcliente[contador]); contador++ } return res.redirect("/listadeclientes") }; pesquisarcliente = await operacoes.buscandoRepresentante(pesquisadecliente); if (pesquisarcliente.length >= 1) { while (contador != pesquisarcliente.length) { listaDeClientes.push(pesquisarcliente[contador]); contador++ } return res.redirect("/listadeclientes") }; pesquisarcliente = await operacoes.buscandoEmail(pesquisadecliente); if (pesquisarcliente.length >= 1) { while (contador != pesquisarcliente.length) { listaDeClientes.push(pesquisarcliente[contador]); contador++ } return res.redirect("/listadeclientes") } } else { pesquisarcliente = await operacoes.buscandoTelefone(req.query.Telefone); if (pesquisarcliente.length >= 1) { while (contador != pesquisarcliente.length) { listaDeClientes.push(pesquisarcliente[contador]); contador++ } return res.redirect("/listadeclientes") } } req.flash("erro_msg", "Cliente(s) não encontrado(s)!Por favor,Certique Digitar Corretamente No Campo e Tente Novamente!"); return res.redirect("/listadeclientes") } catch (erro) { console.log("Erro Ao Tentar Buscar Cliente: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Buscar Cliente!"); return res.redirect('/home') } }
// METODO DE BUSCA DE ClIENTES NO SISTEMA HELPDESCK

// PAGINA DE CHAMADOS DO FUNCIONARIO NO SISTEMA HELPDESCK
const paginaDeChamadosDoFuncionario = async (req, res) => { if (usuarionosistema.length != 0) { try { let nomedofuncionario = await operacoes.carregandoNomeUsuario(); recebernomedofuncionario = nomedofuncionario.map((e) => { return e.Nome }); let chamadosFuncionariopelonome = await operacoes.buscandoListaDeChamadosDoFuncionario(recebernomedofuncionario); if (chamadosFuncionario != null && chamadosFuncionario != "" && chamadosFuncionario != undefined) { let novochamadodefuncionario = chamadosFuncionario; chamadosFuncionario = []; return res.render("adm/meusChamados", { funcionarioentrando: usuarionosistema, listadechamadoFuncionario: chamadosFuncionariopelonome, pesquisaFuncionario: novochamadodefuncionario }) } return res.render('adm/meusChamados', { funcionarioentrando: usuarionosistema, listadechamadoFuncionario: chamadosFuncionariopelonome }) } catch (erro) { console.log("Erro ao tentar realizar pagina de chamados Do funcionario: " + erro); req.flash("aviso_msg", "Erro ao tentar realizar pagina de chamados Do funcionario!"); return res.redirect('/home') } } return res.redirect("/") }
// PAGINA DE CHAMADOS DO FUNCIONARIO NO SISTEMA HELPDESCK

// METODO DE BUSCA DE CHAMADOS DO FUNCIONARIO
const buscarChamadosDoFuncionario = async (req, res) => {
    try {
        let contador = 0; let chamadosFuncionarioPesquisa; if (req.query.funcionario != undefined) {
            let pesquisadeFuncionario = await operacoes.correcaoDeVariavel(req.query.funcionario); chamadosFuncionarioPesquisa = await operacoes.buscandoTitulo(pesquisadeFuncionario);
            if (chamadosFuncionarioPesquisa.length >= 1) { while (contador != chamadosFuncionarioPesquisa.length) { if (chamadosFuncionarioPesquisa[contador].Nomedofuncionario == recebernomedofuncionario) { chamadosFuncionario.push(chamadosFuncionarioPesquisa[contador]) } contador++ } return res.redirect('/meusChamados') } chamadosFuncionarioPesquisa = await operacoes.buscandoDescricao(pesquisadeFuncionario); if (chamadosFuncionarioPesquisa.length >= 1) { while (contador != chamadosFuncionarioPesquisa.length) { if (chamadosFuncionarioPesquisa[contador].Nomedofuncionario == recebernomedofuncionario) { chamadosFuncionario.push(chamadosFuncionarioPesquisa[contador]) } contador++ } return res.redirect('/meusChamados') } chamadosFuncionarioPesquisa = await operacoes.buscandoManutencao(pesquisadeFuncionario); if (chamadosFuncionarioPesquisa.length >= 1) { while (contador != chamadosFuncionarioPesquisa.length) { if (chamadosFuncionarioPesquisa[contador].Nomedofuncionario == recebernomedofuncionario) { chamadosFuncionario.push(chamadosFuncionarioPesquisa[contador]) } contador++ } return res.redirect('/meusChamados') } chamadosFuncionarioPesquisa = await operacoes.buscandoStatus(pesquisadeFuncionario); if (chamadosFuncionarioPesquisa.length >= 1) { while (contador != chamadosFuncionarioPesquisa.length) { if (chamadosFuncionarioPesquisa[contador].Nomedofuncionario == recebernomedofuncionario) { chamadosFuncionario.push(chamadosFuncionarioPesquisa[contador]) } contador++ } return res.redirect('/meusChamados') }
        } else { chamadosFuncionarioPesquisa = await operacoes.buscandoTempo(req.query.Data); if (chamadosFuncionarioPesquisa.length >= 1) { while (contador != chamadosFuncionarioPesquisa.length) { if (chamadosFuncionarioPesquisa[contador].Nomedofuncionario == recebernomedofuncionario) { chamadosFuncionario.push(chamadosFuncionarioPesquisa[contador]) } contador++ } return res.redirect("/meusChamados") } } req.flash("erro_msg", "Chamado(s) Não Encontrado(s)!Determinada Informação Não Está Salva No Banco De Dados De Acordo Com Seu Historico!"); return res.redirect('/meusChamados')
    } catch (erro) { console.log("Erro Ao Tentar Buscar Chamados Do Funcionario:" + erro); req.flash("aviso_msg", "Erro ao Tentar Buscar Chamados Do Funcionario!"); return res.redirect('/home') }
}
// METODO DE BUSCA DE CHAMADOS DO FUNCIONARIO

//PAGINA DE VISUALIZAÇÃO PARA ALTERAÇÃO DE DADOS DO CHAMADO
const paginadeAlteradostatus = async (req, res) => { if (usuarionosistema.length != 0) { try { let receberid = usuarionosistema.map((e) => { return e.Usuario; }); let senhadousuario = await operacoes.buscandoUsuarioId(receberid); statusFuncionario = await operacoes.listandoChamdosPorId(req.query.chave); return res.render("adm/alterastatus", { alterarInformacoes: statusFuncionario, funcionarioentrando: usuarionosistema, chavedeFuncionario: senhadousuario }) } catch (erro) { console.log("Erro Ao Tentar Realizar Pagina De Alteração De Status: " + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Pagina De Alteração De Status!"); return res.redirect('/home') } } return res.redirect("/") }
//PAGINA DE VISUALIZAÇÃO PARA ALTERAÇÃO DE DADOS DO CHAMADO

// METODO PARA REALIZAR ALTERAÇÃO DO CHAMADO 
const realizarAlteracao = async (req, res) => {
    try {
        let atualizacao; let iddeparametro = statusFuncionario.map(function (e) { return e.id; }); if (req.body.manutencao != undefined && req.body.manutencao != "" && req.body.manutencao != null) { atualizacao = await operacoes.updateManutencao(iddeparametro, req.body.manutencao); if (atualizacao != "" && atualizacao != null && atualizacao != undefined) { req.flash("success_msg", "Atualização De Manutenção Realizada Com Sucesso!"); return res.redirect("/meusChamados") } }
        if (req.body.status != undefined && req.body.status != "" && req.body.status != null) { atualizacao = await operacoes.updateStatus(iddeparametro, req.body.status); if (atualizacao != "" && atualizacao != null && atualizacao != undefined) { req.flash("success_msg", "Atualização De Status Realizada Com Sucesso!"); return res.redirect("/meusChamados") } }
        if (req.body.data != undefined && req.body.data != "" && req.body.data != undefined) {
            if (moment(new Date(req.body.data)).format("YYYY/MM/DD") >= moment(new Date()).format("YYYY/MM/DD")) {
                if (await operacoes.buscandoTempo(req.body.data) == "") {
                    atualizacao = await operacoes.updateTempoestimado(iddeparametro, req.body.data); if (atualizacao != "" && atualizacao != null && atualizacao != undefined) {
                        req.flash("success_msg", "Atualização De Tempo Estimado Realizada Com Sucesso!"); return res.redirect("/meusChamados")
                    }
                } req.flash("aviso_msg", "AVISO!A Data Selecionada Já Consta No Sistema Para Outro Chamado,Por Favor, Selecione Outra Data!"); return res.redirect('/meusChamados')
            }
            req.flash("aviso_msg", "AVISO Data Invalida!O Sistema não Aceita Data Que Seja Antecessoras a Data Atual,Por favor, Selecione Outra Data"); return res.redirect('/meusChamados')
        }
        req.flash("erro_msg", "Erro Ao Atualizar Informações Do Chamado!Nenhum Campo Foi Selecionado,Por Favor, Tente Novamente!"); return res.redirect('/meusChamados')

    } catch (erro) { console.log("Erro Ao Tentar Inicializar Alteração Do Chamado:" + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Alteração Do Chamado!"); return res.redirect('/home') }
}
// METODO PARA REALIZAR ALTERAÇÃO DO CHAMADO 


// METODO PARA REALIZAR  ALTERAÇÃO DO PRODUTO
const realizarAlteracaoDeProduto = async (req, res) => {
    let novafoto;
    try {
        let senhadigitada = await operacoes.correcaoDeVariavel(req.body.senhadigitada); let senhaverdadeira = await operacoes.correcaoDeVariavel(req.body.senhadousuario); let atualizacaoDoProduto;
        if (senhadigitada === senhaverdadeira) {
            if (req.body.nomedoprodutonovo != "" && req.body.nomedoprodutonovo != null && req.body.nomedoprodutonovo != undefined) { atualizacaoDoProduto = await operacoes.updateNomeDoProduto(req.body.id, req.body.nomedoprodutonovo); if (atualizacaoDoProduto != "" && atualizacaoDoProduto != null && atualizacaoDoProduto != undefined) { req.flash("success_msg", "Atualização Do Nome do Produto Foi Realizada Com Sucesso!"); return res.redirect("/listadeprodutos") } }
            if (req.body.valornovo != "" && req.body.valornovo != null && req.body.valornovo != undefined) { atualizacaoDoProduto = await operacoes.updateValorDoProduto(req.body.id, req.body.valornovo); if (atualizacaoDoProduto != "" && atualizacaoDoProduto != null && atualizacaoDoProduto != undefined) { req.flash("success_msg", "Atualização Do Valor Do Produto Foi Realizada Com Sucesso!"); return res.redirect("/listadeprodutos") } }

            if (req.file) {
                try { cloudinary.cloudinary.v2.uploader.destroy(req.body.imagem); } catch (erro) { console.log("Falha Ao Tentar Substituir A Foto Anterior! " + erro); req.flash("erro_msg", "Falha Ao Tentar Substituir A Foto Anterior!"); return res.redirect("/listadeprodutos") }; try { novafoto = await cloudinary.cloudinary.v2.uploader.upload(req.file.path) } catch (erro) { console.log("Falha Ao Tentar Colocar A Nova Foto! " + erro) } atualizacaoDoProduto = await operacoes.updateFotoDoProduto(req.body.id, novafoto); if (atualizacaoDoProduto != "" && atualizacaoDoProduto != null && atualizacaoDoProduto != undefined) {
                    if (novafoto != "" && novafoto != null && novafoto != undefined) {
                        req.flash("success_msg", "Atualização Da Foto Do Produto Foi Realizada com Sucesso!");
                        return res.redirect("/listadeprodutos")
                    } req.flash("erro_msg", "Falha Ao Tentar Atualizar A Foto!"); return res.redirect("/listadeprodutos")
                } req.flash("erro_msg", "Falha Ao Tentar Atualizar A Foto!"); return res.redirect("/listadeprodutos")
            }
            if (req.body.novaquantidade != "" && req.body.novaquantidade != null && req.body.novaquantidade != undefined) { atualizacaoDoProduto = await operacoes.updateQuantidadeDoProduto(req.body.id, req.body.novaquantidade); if (atualizacaoDoProduto != "" && atualizacaoDoProduto != null && atualizacaoDoProduto != undefined) { req.flash("success_msg", "Atualização Da Quantiade Do Produto Foi Realizada Com Sucesso!"); return res.redirect("/listadeprodutos") } }
            let testeimagem = (imagem => { if (imagem == true) { return true } return false })
            if (testeimagem(res.file) == false) {
                req.flash("aviso_msg", "AVISO!O Formato de Imagem Escolhido, Não é Aceito Por Esse Sistema!Formatos Aceitos São: PNG,JPG e JPEG.!"); return res.redirect("/listadeprodutos")
            }
            req.flash("erro_msg", "Erro de Atualização De Dados!Para Realizar Uma Atualização,Selecione um Campo e O Preencha-o!")
            return res.redirect("/listadeprodutos")
        }
        req.flash("aviso_msg", "AVISO!Senha Digita Não Foi Aceita Como Valida!Por favor, Tente Novamente.")
        return res.redirect('/listadeprodutos')
    } catch (erro) { console.log("Erro Ao Tentar Realizar Alteração De Produto:" + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Alteração De Produto!"); return res.redirect('/home') }

}

// METODO PARA REALIZAR  ALTERAÇÃO DO PRODUTO

// METODO PARA REALIZAR  EXCLUSÃO DO CHAMADO
const excluirChamado = async (req, res) => { try { let senhadigitada = await operacoes.correcaoDeVariavel(req.body.senhadigitada); let senhaverdadeira = await operacoes.correcaoDeVariavel(req.body.senhadousuario); if (senhadigitada === senhaverdadeira) { operacoes.deletarChamado(req.body.id); cloudinary.cloudinary.v2.uploader.destroy(req.body.imagem); req.flash("success_msg", "Chamado Excluido Com Sucesso!"); return res.redirect('/meusChamados') } req.flash("erro_msg", "Erro!Senha Digita Não Foi Aceita Pelo Sistema,Por favor,Tente Novamente!"); return res.redirect('/meusChamados') } catch (erro) { console.log("Erro Ao Tentar Realizar Excluir Chamado:" + erro); req.flash("aviso_msg", "Erro Ao Tentar Realizar Excluir Chamado!"); return res.redirect('/home') } }
// METODO PARA REALIZAR  EXCLUSÃO DO CHAMADO


// METODO PARA REALIZAR  EXCLUSÃO DO PRODUTO 
const excluirProduto = async (req, res) => { try { let senhadigitada = await operacoes.correcaoDeVariavel(req.body.senhadigitada); let senhaverdadeira = await operacoes.correcaoDeVariavel(req.body.senhadousuario); if (senhadigitada === senhaverdadeira) { operacoes.deletarProduto(req.body.id); cloudinary.cloudinary.v2.uploader.destroy(req.body.imagem); req.flash("success_msg", "Produto Excluido Com Sucesso!"); return res.redirect('/listadeprodutos') } req.flash("erro_msg", "Não Foi Possivel Apagar Produto!Por favor,Tente Novamente!"); return res.redirect('/listadeprodutos') } catch (erro) { console.log("Erro Ao Tentar Excluir Produto:" + erro); req.flash("aviso_msg", "Erro Ao Tentar Excluir Produto!"); return res.redirect('/home') } }
// METODO PARA REALIZAR  EXCLUSÃO DO PRODUTO


export default {
    inicializacao,
    paginaCadastro,
    realizarCadastroDeUsuario,
    Login,
    paginaInicial,
    paginadeChamados,
    cadastrarChamado,
    paginaDeListagemDeChamados,
    buscarListagemDeChamados,
    paginaDeListagemDeProdutos,
    buscarproduto,
    paginaDeListagemDeClientes,
    buscarcliente,
    paginaDeChamadosDoFuncionario,
    buscarChamadosDoFuncionario,
    paginadeAlteradostatus,
    realizarAlteracao,
    realizarAlteracaoDeProduto,
    excluirChamado,
    excluirProduto,
}

