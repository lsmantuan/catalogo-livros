var view = {
    adicionarLivro: function() {
        var biblioteca = document.getElementById("container");
        var livro = document.createElement("article");

        var iLivros = model.biblioteca.length - 1;
        var capa = model.biblioteca[iLivros].capa;
        var titulo = model.biblioteca[iLivros].titulo;
        var categorias = model.biblioteca[iLivros].categorias;
        
        livro.className = "item";
        livro.innerHTML += 
            `<div class="capa">
                <img src="${capa}">
            </div>
            <div class="conteudo">
                <h2>${titulo}</h2>
                <ul class="autores"></ul>
                <ul class="categorias"></ul>
            </div>`;
        biblioteca.appendChild(livro);
        view.adicionarAutores(iLivros);
        view.adicionarCategorias(iLivros);
    },

    adicionarAutores: function(iLivros) {
        var iAutores = model.biblioteca[iLivros].autores.length;
        for (let i = 0; i < iAutores; i++) {
            var autores = model.biblioteca[iLivros].autores[i];
            var listaAutores = document.getElementsByClassName("autores");
            var listaAutor = document.createElement("li");
            listaAutor.innerHTML = `<li><h3>${autores}</h3></li>`;
            listaAutores[iLivros].appendChild(listaAutor);
        }
    },

    adicionarCategorias: function(iLivros) {
        var iCategorias = model.biblioteca[iLivros].categorias.length;
        for (let i = 0; i < iCategorias; i++) {
            var categorias = model.biblioteca[iLivros].categorias[i];
            var listaCategorias = document.getElementsByClassName("categorias");
            var listaCategoria = document.createElement("li");
            listaCategoria.innerHTML = `<li>${categorias}</li>`;
            listaCategorias[iLivros].appendChild(listaCategoria);
        }        
    }
};

var model = {
    biblioteca: [
            {
                "titulo": "De primatas a astronautas",
                "autores": [
                    "Leonard Mlodinow"
                ],
                "categorias": [
                    "Science"
                ],
                "capa": "http://books.google.com/books/content?id=7xLUDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
            }
    ],

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
                var livro = new Livro(titulo, autores, categorias, capa);
                model.biblioteca.push(livro);
                view.adicionarLivro();
            });
    },

    carregarLivros: function() {
        for (let i = 0; i < this.biblioteca.length; i++) {
            return view.adicionarLivro();
        }
    }
}

function Livro(titulo, autores, categorias, capa) {
        this.titulo = titulo;
        this.autores = autores;
        this.categorias = categorias;
        this.capa = capa;
}

window.onload = function() {
    var procurar = document.getElementById("procurar");
    procurar.addEventListener("click", model.pesquisarLivro)
    model.carregarLivros();
}