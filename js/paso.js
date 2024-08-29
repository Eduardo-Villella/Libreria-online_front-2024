/*async updateUser(req = request, res = response) {
    try {
        console.log('en controller, update: req.body ', req.body); // borrar
        console.log('en controller, update: req.user:', req.user); // borrar 

        const idFromParams = parseInt(req.params.id, 10); // Obtiene el ID desde los parametros de la ruta y lo convierte a entero 
        const idFromUser = req.user?.id || req.user?.id_usuarios || req.user?.userId; // Obtiene el ID del objeto req.user
        console.log('en controller, update req.user.id, req.user.id_usuarios, req.user.userId: ', req.user.id, req.user.id_usuarios, req.user.userId); // borrar

        const id = idFromParams || idFromUser; // Verifica si idFromParams es valido y, si no, usa idFromUser
        console.log('en controller, update: id', id); // Verifica el ID que se está utilizando

        if (!id) {
            throw new Error("en controller, update: ID de usuario no definido");
        }

        const userEntity = req.body;

        // Filtro campos undefined para no pasar datos null
        const updatedFields = {};
        for (const key in userEntity) {
            if (userEntity.hasOwnProperty(key) && userEntity[key] !== undefined) {
                updatedFields[key] = userEntity[key];
            }
        }
        console.log('en controller, update: Campos actualizados:', updatedFields); // borrar Verifica qué campos se están actualizando

        const result = await this.model.update(updatedFields, id);
        res.status(200).json({ success: true, result });

    } catch (error) {
        res.status(500).json({ error: `en controller, update: Error al actualizar usuario: ${error.message}` });
    }
}*/