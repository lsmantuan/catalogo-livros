var view = {
    adicionarLivro: function() {
        var biblioteca = document.getElementById("container");
        var livro = document.createElement("article");

        var iLivros = model.biblioteca.length - 1;
        var capa = model.biblioteca[iLivros].capa;
        var titulo = model.biblioteca[iLivros].titulo;
        var isbn = model.biblioteca[iLivros].isbn;
        
        livro.className = "item";
        livro.id = isbn;
        livro.innerHTML += 
            `<div class="capa">
                <img src="${capa}">
            </div>
            <div class="conteudo">
                <h2>${titulo}</h2>
                <ul class="autores"></ul>
                <ul class="categorias"></ul>
            </div>
            <div class="ferramentas">
                <input type="button" id="botaoEditar" class="botaoEditar" value="🗑">
                <input type="button" id="botaoExcluir" class="botaoExcluir" value="🗑">
            </div>`;
        biblioteca.appendChild(livro);
        view.adicionarAutores(iLivros);
        view.adicionarCategorias(iLivros);
        model.ativarBotoes();
    },

    adicionarAutores: function(iLivros) {
        var iAutores = model.biblioteca[iLivros].autores.length;
        for (let i = 0; i < iAutores; i++) {
            var autores = model.biblioteca[iLivros].autores[i];
            var listaAutores = document.getElementsByClassName("autores");
            var listaAutor = document.createElement("li");
            listaAutor.innerHTML = `<h3>${autores}</h3>`;
            listaAutores[iLivros].appendChild(listaAutor);
        }
    },

    adicionarCategorias: function(iLivros) {
        var iCategorias = model.biblioteca[iLivros].categorias.length;
        for (let i = 0; i < iCategorias; i++) {
            var categorias = model.biblioteca[iLivros].categorias[i];
            var listaCategorias = document.getElementsByClassName("categorias");
            var listaCategoria = document.createElement("li");
            listaCategoria.innerHTML = `${categorias}`;
            listaCategorias[iLivros].appendChild(listaCategoria);
        }        
    }
};

var model = {
    biblioteca: [],

    pesquisarLivro: function() {
        var isbn = document.getElementById("isbn");
        var link = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn.value;

        fetch(link)
            .then((response) => response.json())
            .then(function(response) {
                var titulo = response.items[0].volumeInfo.title;
                var autores = response.items[0].volumeInfo.authors;
                var categorias = response.items[0].volumeInfo.categories;
                var capa = response.items[0].volumeInfo.imageLinks.thumbnail;
                var isbn = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
                var livro = new Livro(titulo, autores, categorias, isbn, capa);
                model.biblioteca.push(livro);
                view.adicionarLivro();
            });
    },

    carregarLivros: function() {
        for (let i = 0; i < this.biblioteca.length; i++) {
            return view.adicionarLivro();
        }
    },

    ativarBotoes: function() {
        var botoesExcluir = document.getElementsByClassName("botaoExcluir");
        for (let i = 0; i < botoesExcluir.length; i++) {
            botoesExcluir[i].onclick = controller.ferramentas;
        }
    }
}

var controller = {
    ferramentas: function(event) {
        
        // remove o livro do array
        var idLivro = event.composedPath()[2].id;
        for (let i = 0; i < model.biblioteca.length; i++) {
            var iLivro = model.biblioteca[i].isbn.indexOf(idLivro)
            if (iLivro === 0) {
                // estudar melhor o funcionamento do método splice *******************
                // entender o erro quando ser encontra o mesmo livro duas vezes
                // filtrar a possibilidade de inserir dois livros iguais
                model.biblioteca.splice(i, 1)
            }
        }

        // remove o livro da exibição
        var pai = document.getElementById("container");
        var filho = document.getElementById(idLivro)
        pai.removeChild(filho);
    }
}

function Livro(titulo, autores, categorias, isbn, capa) {
        this.titulo = titulo;
        this.autores = autores;
        this.categorias = categorias;
        this.isbn = isbn;
        this.capa = capa;
}

window.onload = function() {
    var procurar = document.getElementById("botaoProcurar");
    procurar.addEventListener("click", model.pesquisarLivro);
    model.carregarLivros();
    model.ativarBotoes();
}