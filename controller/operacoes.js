import mongoose from 'mongoose'
import cloudinary from '../utils/cloudinary.js'
import "../models/Usuario.js"
import "../models/Chamado.js"
import "../models/Funcionario.js"
import "../models/Produtos.js"
const usuario = mongoose.model("usuarios");
const chamado = mongoose.model("chamados");
const funcionario = mongoose.model("funcionarios");
const produto = mongoose.model("produtos");
let idusuario = [];
let usuarioscadastrados = [];
/* METODO DE CORREÇÃO DE VARIAVEL */
let correcaoDeVariavel = async (variavel) => { let corrigindo; try { corrigindo = variavel.toLowerCase().trim().replace(/( ){2,}/g, '$1'); return corrigindo } catch (erro) { console.log("Erro ao tentar corrigir variavel: " + erro); return null } }
/* METODO DE CORREÇÃO DE VARIAVEL */

/* METODOS DE VALIDAÇÃO*/
let validarEntradaDeUsuario = async (login, senha) => { let entrandoUsuarios; try { entrandoUsuarios = await usuario.find({ login: login, senha: senha }); idusuario = entrandoUsuarios.map((e) => { return e._id; }); if (entrandoUsuarios == undefined || entrandoUsuarios == null || entrandoUsuarios == "") { return true } else { return false } } catch (erro) { console.log("Erro ao tentar validar entrada de Usuarios: " + erro); return null } }

let validarcadastroUsuario = async (login, senha, Nome, Cargo) => { let usuarios1; let usuarios2; try { usuarios1 = await usuario.findOne({ login: login }); usuarios2 = await usuario.findOne({ senha: senha }); if (usuarios1 === null && usuarios2 === null) { let usuarionovo = { login, senha }; let funcionarios = await funcionario.find({ Nome: Nome }); if (funcionarios == "") { usuarioscadastrados = await new usuario(usuarionovo).save(); let Usuario = usuarioscadastrados.id; let funcionarionovo = { Nome, Cargo, Usuario }; new funcionario(funcionarionovo).save(); return true } else { return false } } else { return false } } catch (erro) { console.log("Erro tentar validar cadastro de Usuaria: " + erro); return null } }

let validacaoDeEmail = async (variavel) => { let validar; try { validar = /^[\[a-zA-Zà-úÀ-Ú0-9.\+]+@(gmail)\.com(?:.\w{2})?$/; return validar.test(variavel) } catch (erro) { console.log("Erro ao tentar validar e-mail: " + erro); return null } }

let validacaoTexto = async (variavel) => { let validar; try { validar = /[A-Za-z]/; return validar.test(variavel) } catch (erro) { console.log("Erro ao tentar validar texto: " + erro); return null } }
/* METODOS DE VALIDAÇÃO */

/* METODOS DE LISTAGEM DE DADOS  */
let carregandoNomeUsuario = async () => { let carregandoUsuario; try { carregandoUsuario = await funcionario.find({ Usuario: idusuario }); if (carregandoUsuario != undefined && carregandoUsuario != null && carregandoUsuario != "") { return carregandoUsuario } else { return null } } catch (erro) { console.log("Erro ao tentar carregar nome do usuario: " + erro); return null } }

let listandoDatas = async (horario) => { let listandoHorario; try { listandoHorario = await chamado.findOne({ Tempoestimado: horario }); return listandoHorario } catch (erro) { console.log("Erro ao tentar listar datas:" + erro) } }

let listandoChamadosEmEspera = async () => { let listandochamadosemespera; try { listandochamadosemespera = await chamado.find({ Status: 'em espera' }); return listandochamadosemespera } catch (error) { console.log("Erro ao tentar buscar lista de chamados com Status em espera"); return null } }

let listandoChamadosEmProcesso = async () => { let listadechadosemeprocesso; try { listadechadosemeprocesso = await chamado.find({ Status: 'em processo' }); return listadechadosemeprocesso } catch (error) { console.log("Erro ao tentar buscar lista de chamados com Status em processo: " + error); return null } }

let listandoFuncionariosSelecionados = async (nomeFuncio) => { let listandofuncinarioSelecionado; try { listandofuncinarioSelecionado = await funcionario.find({ Nome: nomeFuncio }); return listandofuncinarioSelecionado } catch (erro) { console.log("Erro ao tentar listar funcionario selecionados: " + erro); return null } }

let listandoFuncionarios = async () => { let listandofuncinario; try { listandofuncinario = await funcionario.find(); return listandofuncinario } catch (error) { console.log("Erro ao tentar listarFuncionarios: " + error); return null } }

let listandoChamados = async () => { let listandoChamado; try { listandoChamado = await chamado.find(); return listandoChamado } catch (erro) { console.log("Erro ao tentar listar chamados: " + erro); return null } }

let listandoProdutos = async () => { let listandoProdutos; try { listandoProdutos = await produto.find(); return listandoProdutos } catch (erro) { console.log("Erro ao tenrar listar produtos: " + erro); return null } }

let listandoChamdosPorId = async (idfornecido) => { let listandoporid; try { listandoporid = await chamado.find({ _id: idfornecido }); return listandoporid } catch (erro) { console.log("Erro ao tentar listar chamados por id: " + erro); return null } }

/* METODOS DE LISTAGEM DE DADOS  */



/* METODOS DE BUSCA */
let buscandoUsuarioId = async (id) => { let carregandoUsuario; try { carregandoUsuario = await usuario.find({ _id: id }); return carregandoUsuario } catch (erro) { console.log("Erro ao buscar usuario por id: " + erro); return null } }

let buscandoProdutosPorNome = async (produtopesquisa) => { let buscandoproduto; try { buscandoproduto = await produto.findOne({ NomedoProduto: new RegExp(`${produtopesquisa}`) }); return buscandoproduto } catch (erro) { console.log("Erro ao buscar produtos pelo nome: " + erro); return null } }

let buscandoProdutosPorValor = async (produtopesquisa) => { let buscandoproduto; try { buscandoproduto = await produto.findOne({ Valor: produtopesquisa }); return buscandoproduto } catch (erro) { console.log("Erro ao buscar produtos por valor pelo nome: " + erro); return null } }

let buscandoProdutosPorCadastrador = async (produtopesquisa) => { let buscandoproduto; try { buscandoproduto = await produto.findOne({ Cadastrador: new RegExp(`${produtopesquisa}`) }); return buscandoproduto } catch (erro) { console.log("Erro ao buscar produtos por  Cadastrador: " + erro); return null } }

let buscandoEmpresas = async (cliente) => { let buscandoempresa; try { buscandoempresa = await chamado.find({ Empresa: new RegExp(`${cliente}`) }); return buscandoempresa } catch (erro) { console.log("Erro ao buscar empresas: " + erro); return null } }

let buscandoRepresentante = async (cliente) => { let buscandoRepresentante; try { buscandoRepresentante = await chamado.find({ Representante: new RegExp(`${cliente}`) }); return buscandoRepresentante } catch (erro) { console.log("Erro ao buscar Representante: " + erro); return null } }

let buscandoTelefone = async (cliente) => { let buscandotelefone; try { buscandotelefone = await chamado.find({ Telefone: cliente }); return buscandotelefone } catch (erro) { console.log("Erro ao buscar Telefone: " + erro); return null } }

let buscandoEmail = async (cliente) => { let buscandoEmail; try { buscandoEmail = await chamado.find({ Email: new RegExp(`${cliente}`) }); return buscandoEmail } catch (erro) { console.log("Erro ao buscar Email: " + erro); return null } }

let buscandoListaDeChamadosDoFuncionario = async (nome) => { let buscandochamadosdofuncionario; try { buscandochamadosdofuncionario = await chamado.find({ Nomedofuncionario: nome }); return buscandochamadosdofuncionario } catch (erro) { console.log("Erro ao buscar lista de chamados do funcionario : " + erro); return null } }

let buscandoTitulo = async (pesquisaFuncionario) => { let buscandoTitulo; try { buscandoTitulo = await chamado.find({ Titulo: new RegExp(`${pesquisaFuncionario}`) }); return buscandoTitulo } catch (erro) { console.log("Erro ao tentar buscar titulo para listagem de chamados: " + erro); return null } }

let buscandoDescricao = async (pesquisaFuncionario) => { let buscandodescricao; try { buscandodescricao = await chamado.find({ Descricao: new RegExp(`${pesquisaFuncionario}`) }); return buscandodescricao } catch (erro) { console.log("Erro ao tentar buscar descrição para listagem de chamados: " + erro); return null } }

let buscandoManutencao = async (pesquisaFuncionario) => { let buscandotemanutencao; try { buscandotemanutencao = await chamado.find({ Manutencao: new RegExp(`${pesquisaFuncionario}`) }); return buscandotemanutencao } catch (erro) { console.log("Erro ao tentar buscar manutenção para listagem de chamados: " + erro); return null } }

let buscandoStatus = async (pesquisaFuncionario) => { let buscandostatus; try { buscandostatus = await chamado.find({ Status: new RegExp(`${pesquisaFuncionario}`) }); return buscandostatus } catch (erro) { console.log("Erro ao tentar buscar status para listagem de chamados: " + erro); return null } }

let buscandoTempo = async (pesquisaFuncionario) => { let buscandotempo; try { buscandotempo = await chamado.find({ Tempoestimado: pesquisaFuncionario }); return buscandotempo } catch (erro) { console.log("Erro ao tentar buscar tempoestimado para listagem de chamados: " + erro); return null } }

/* METODOS DE BUSCA */



/* METODOS DE CADASTRO DE DADOS */
let realizarCadastroDeChamados = async (novochamado) => { let fotoDoCadastroChamado; let realizarCadastroDeChamado; try { fotoDoCadastroChamado = await cloudinary.cloudinary.v2.uploader.upload(novochamado.Foto) } catch (error) { console.log("Erro Com Foto do chamado:" + error) }; novochamado.Foto = fotoDoCadastroChamado; try { realizarCadastroDeChamado; realizarCadastroDeChamado = await new chamado(novochamado).save(); console.log("chamado cadastrado com sucesso:"); return realizarCadastroDeChamado } catch (erro) { cloudinary.cloudinary.v2.uploader.destroy(fotoDoCadastroChamado.public_id); console.log("Erro ao tentar cadastrar chamado: " + erro); return null } }

let realizarCadastroDeProdutos = async (novoproduto) => { let fotoDoProdutoCadastroProdutos; try { fotoDoProdutoCadastroProdutos = await cloudinary.cloudinary.v2.uploader.upload(novoproduto.Foto) } catch (error) { console.log("Erro Com Foto do Produto:" + error) }; novoproduto.Foto = fotoDoProdutoCadastroProdutos; let realizarCadastroDeProduto; try { realizarCadastroDeProduto = await new produto(novoproduto).save(); return realizarCadastroDeProduto } catch (erro) { cloudinary.cloudinary.v2.uploader.destroy(fotoDoProdutoCadastroProdutos.public_id); console.log("Erro ao tentar cadastrar Produto: " + erro); return null } }
/* METODOS DE CADASTRO DE DADOS */


/* METODOS DE CONTAGEM DE DADOS */
let contagemDeChamadosEmEspera = async () => { let lista1; try { lista1 = await chamado.countDocuments({ Status: 'em espera' }); return lista1 } catch (erro) { console.log('Erro ao tentar contar chamados com Status em espera: ' + erro); return null } }

let contagemDeChamadosEmProcesso = async () => { let lista2; try { lista2 = await chamado.countDocuments({ Status: 'em processo' }); return lista2 } catch (erro) { console.log('Erro ao tentar contar chamados com Status em processo: ' + erro); return null } }

/* METODOS DE CONTAGEM DE DADOS */


/* METODOS DE ATUALIZAÇÃO DE DADOS */

let updateManutencao = async (anterior, atualizar) => { let atualizarmanutencao; try { atualizarmanutencao = chamado.findOneAndUpdate({ _id: anterior }, { Manutencao: atualizar }); return atualizarmanutencao } catch (erro) { console.log("Erro ao tentar atualizar Manutencao: " + erro); return null } }

let updateStatus = async (anterior, atualizar) => { let atualizarstatus; try { atualizarstatus = chamado.findOneAndUpdate({ _id: anterior }, { Status: atualizar }); return atualizarstatus } catch (erro) { console.log("Erro ao tentar atualizar Status: " + erro); return null } }

let updateTempoestimado = async (anterior, atualizar) => { let atualizarTempoestimado; try { atualizarTempoestimado = chamado.findOneAndUpdate({ _id: anterior }, { Tempoestimado: atualizar }); return atualizarTempoestimado } catch (erro) { console.log("Erro ao tentar atualizar tempo estimado: " + erro); return null } }

let updateNomeDoProduto = async (anterior, atualizar) => { let atualizarproduto; try { atualizarproduto = produto.findOneAndUpdate({ _id: anterior }, { NomedoProduto: atualizar }); return atualizarproduto } catch (erro) { console.log("Erro ao tentar atualizar nome do produto: " + erro); return null } }

let updateValorDoProduto = async (anterior, atualizar) => { let atualizarproduto; try { atualizarproduto = produto.findOneAndUpdate({ _id: anterior }, { Valor: atualizar }); return atualizarproduto } catch (erro) { console.log("Erro ao tentar atualizar valor do produto: " + erro); return null } }

let updateFotoDoProduto = async (anterior, atualizar) => { let atualizarproduto; try { atualizarproduto = produto.findOneAndUpdate({ _id: anterior }, { Foto: atualizar }); return atualizarproduto } catch (erro) { console.log("Erro ao tentar atualizar foto: " + erro); return null } }

let updateQuantidadeDoProduto = async (anterior, atualizar) => { let atualizarproduto; try { atualizarproduto = produto.findOneAndUpdate({ _id: anterior }, { Quantidade: atualizar }); return atualizarproduto } catch (erro) { console.log("Erro ao tentar atualizar quantidade de produto: " + erro); return null } }

/* METODOS DE ATUALIZAÇÃO DE DADOS */


/* METODOS DE DELETAR DADOS */

let deletarChamado = async (parametroid) => { let deletarchamado; try { deletarchamado = chamado.deleteOne({ _id: parametroid }); return deletarchamado } catch (erro) { console.log("Erro ao tentar excluir chamado: " + erro); return null } }

let deletarProduto = async (parametroid) => { let deletarproduto; try { deletarproduto = produto.deleteOne({ _id: parametroid }); return deletarproduto } catch (erro) { console.log("Erro ao tentar excluir produto: " + erro); return null } }
/* METODOS DE DELETAR DADOS */

export default {
    correcaoDeVariavel,
    validarEntradaDeUsuario,
    validarcadastroUsuario,
    validacaoDeEmail,
    validacaoTexto,
    carregandoNomeUsuario,
    listandoDatas,
    listandoChamadosEmEspera,
    listandoChamadosEmProcesso,
    realizarCadastroDeChamados,
    realizarCadastroDeProdutos,
    contagemDeChamadosEmEspera,
    contagemDeChamadosEmProcesso,
    listandoFuncionariosSelecionados,
    listandoFuncionarios,
    listandoProdutos,
    listandoChamados,
    listandoChamdosPorId,
    buscandoUsuarioId,
    buscandoProdutosPorNome,
    buscandoProdutosPorValor,
    buscandoProdutosPorCadastrador,
    buscandoEmpresas,
    buscandoRepresentante,
    buscandoTelefone,
    buscandoEmail,
    buscandoListaDeChamadosDoFuncionario,
    buscandoTitulo,
    buscandoDescricao,
    buscandoManutencao,
    buscandoStatus,
    buscandoTempo,
    updateManutencao,
    updateStatus,
    updateTempoestimado,
    updateNomeDoProduto,
    updateValorDoProduto,
    updateFotoDoProduto,
    updateQuantidadeDoProduto,
    deletarChamado,
    deletarProduto
}