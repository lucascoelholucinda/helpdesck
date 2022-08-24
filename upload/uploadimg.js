import multer from 'multer'
export default (multer({
    storage: multer.diskStorage({}),
    fileFilter: (res, file, cb) => {
        const imagem = ['image/png', 'image/jpg', 'image/jpeg'].find(formatoAceito => formatoAceito == file.mimetype)
        if (imagem) {
            return cb(null, true)
        }
        return cb(null, false)
    },

}))