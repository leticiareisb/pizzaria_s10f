document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('editarUsuarioForm');
    const mensagem = document.getElementById('mensagemEditarUsuario');
    
    const token = localStorage.getItem('token');

    function carregarDadosUsuario(userId) {
        fetch(`http://localhost:8000/api/user/visualizar/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('editarNome').value = data.user.name;
            document.getElementById('editarEmail').value = data.user.email;
            document.getElementById('userId').value = data.user.id;
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do usuário:', error);
            mensagem.textContent = 'Erro ao carregar os dados do usuário.';
        });
    }

    document.querySelectorAll('.editar-usuario').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            carregarDadosUsuario(userId);

            const editarModal = new bootstrap.Modal(document.getElementById('editarUsuarioModal'));
            editarModal.show();
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const usuarioAtualizado = {
            name: document.getElementById('editarNome').value,
            email: document.getElementById('editarEmail').value
        };

        fetch(`http://localhost:8000/api/user/atualizar/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioAtualizado)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                mensagem.textContent = 'Usuário atualizado com sucesso!';
                listarUsuarios();
            } else {
                mensagem.textContent = 'Erro ao atualizar o usuário: ' + data.message;
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar o usuário:', error);
            mensagem.textContent = 'Erro ao atualizar o usuário. Tente novamente.';
        });
    });
});
