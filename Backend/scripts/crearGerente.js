(async () => {
    try {
        const { initModels } = require('../models'); // Ajusta la ruta según tu estructura
        const Usuario = require('../models/Usuario');
        await initModels(); // Sincroniza los modelos con la BD

        const newUsuario = await Usuario.create({
            nombre: 'Ivan',
            apellido: 'Gonzalez',
            documento: '123456789',
            correo: 'ivan@gmail.com',
            telefono: '123456789',
            contrasena: '123456',
            rol: 'gerente',
            activo: true
        });

        console.log('Usuario creado:', newUsuario.toJSON());
        process.exit(0);
    } catch (error) {
        console.error('Error creando el usuario:', error);
        process.exit(1); // Sal con código de error
        }
})();
