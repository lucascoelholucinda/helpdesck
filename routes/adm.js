import express from 'express'
const router = express.Router() 
import uploadUser from '../upload/uploadimg.js'
import admController from '../controller/adm.js'




/* METODOS GET PARA REDIRECIONAMENTO */
router.get('/', admController.inicializacao);
router.get('/home', admController.paginaInicial);
router.get('/cadastrar', admController.paginaCadastro);
router.get('/chamados', admController.paginadeChamados);
router.get('/listadechamados', admController.paginaDeListagemDeChamados);
router.get('/listaprodutos', admController.paginaDeListagemDeProdutos,);
router.get('/listaclientes', admController.paginaDeListagemDeClientes);
router.get('/meusChamados', admController.paginaDeChamadosDoFuncionario);
/* METODOS GET PARA REDIRECIONAMENTO */


/*METODOS GET PARA PESQUISA */
router.get('/Login', admController.Login);
router.get('/buscarproduto/', admController.buscarproduto);
router.get('/buscarcliente/', admController.buscarcliente);
router.get('/buscandochamadosdofuncionario/', admController.buscarChamadosDoFuncionario);
router.get('/buscandolistagemdechamados/', admController.buscarListagemDeChamados);
router.get('/alteracaodestatus/', admController.paginadeAlteradostatus);
/*METODOS GET PARA PESQUISA */


/* METODOS PUT PARA ATUALIZAR DE DADOS  */
router.put('/realizarAlteracao/', admController.realizarAlteracao);
router.put('/realizarAlteracaoDeProduto/', uploadUser.single('fotonova'), admController.realizarAlteracaoDeProduto);
/* METODOD PUT PARA ATUALIZAR DE DADOS  */

/* METODOS POST POSTAGEM DE DADOS */
router.post('/usuario', admController.realizarCadastroDeUsuario);
router.post('/cadastrarchamado', uploadUser.single('Foto'), admController.cadastrarChamado)
/* METODOS POST POSTAGEM DE DADOS */

/* METODOS DE DELELE DE DADOS */
router.delete('/excluirChamado', admController.excluirChamado)
router.delete('/excluirProduto', admController.excluirProduto)
/* METODOS DE DELELE DE DADOS */



export default router 