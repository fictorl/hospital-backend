
function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Token inválido ou não fornecido' });
    } else {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
  }

module.exports = errorHandler;