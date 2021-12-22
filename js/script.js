var view = {
    adicionarLivro: function() {
        var biblioteca = document.getElementById("containerLivros");
        var livro = document.createElement("article");

        var iLivros = model.biblioteca.length - 1;
        var capa = model.biblioteca[iLivros].capa;
        var titulo = model.biblioteca[iLivros].titulo;
        var isbn = model.biblioteca[iLivros].isbn;
        
        livro.className = "item";
        livro.id = isbn;
        livro.innerHTML += 
            `<div class="ferramentas">
                <div class="editarExcluir">
                    <input type="button" class="botaoEditar" value="&#9998;">
                    <input type="button" class="botaoExcluir" value="&#128465;">
                </div>
                <div class="abrirFechar">
                    <input type="button" class="botaoAbrir" value="&#706;">
                    <input type="button" class="botaoFechar" value="&#707;">
                </div>
            </div>
            <div class="capa">
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
    },

    carregando: function carregando(status) {
        var container = document.getElementById("containerLoader");
        if (status === true) {
            var loader = document.createElement("div");
            loader.setAttribute("class", "loader");
            container.appendChild(loader);        
        } else if (status === false) {
            container.removeChild(container.lastChild);
        }
    },

    menu: function(event) {
        console.log(event.composedPath());
        var status = event.target.className;
        var ferramentas = event.composedPath()[3].children[0];
        var botaoAbrir = ferramentas.children[1].children[0];
        var botaoFechar = ferramentas.children[1].children[1];
        if (status === "botaoAbrir") {
            ferramentas.style.width = "80px";
            botaoAbrir.style.display = "none";
            botaoFechar.style.display = "block";
        } else if (status === "botaoFechar") {
            ferramentas.style.width = "20px";
            botaoAbrir.style.display = "block";
            botaoFechar.style.display = "none";
        }
    }
};

var model = {
    nome: "Minha Biblioteca",
    biblioteca: [],

    pesquisarLivro: function() {
        var isbn = document.getElementById("isbn");
        var link = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn.value;
        
        view.carregando(true);

        fetch(link)
            .then(function(response) {
                return response.json();
            })

            .then(function(response) {
                var titulo = response.items[0].volumeInfo.title;
                var autores = response.items[0].volumeInfo.authors;
                var categorias = response.items[0].volumeInfo.categories;
                var capa = response.items[0].volumeInfo.imageLinks.thumbnail;
                var isbn = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
                var livro = new Livro(titulo, autores, categorias, isbn, capa);
                model.biblioteca.push(livro);
                view.carregando(false);
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
        var botoesEditar = document.getElementsByClassName("botaoEditar");
        var botoesAbrir = document.getElementsByClassName("botaoAbrir");
        var botoesFechar = document.getElementsByClassName("botaoFechar");
        
        // criar um valor para botõesExcluir.length
        for (let i = 0; i < botoesExcluir.length; i++) {
            botoesExcluir[i].onclick = controller.excluir;
            botoesEditar[i].onclick = controller.editar;
            botoesAbrir[i].onclick = view.menu;
            botoesFechar[i].onclick = view.menu;
        }
    },

    editavel: function(path, editavel) {
        var titulo = path.children[2].children[0];
        var autores = path.children[2].children[1].children;
        var categorias = path.children[2].children[2].children;

        // ONDE COLOCAR?
        model.escutar(path, titulo);

        if (editavel === true) {
            titulo.setAttribute("contenteditable", "true");
            titulo.className = "editavel";

            for (let i = 0; i < autores.length; i++) {
                autores[i].children[0].setAttribute("contenteditable", "true");
                autores[i].children[0].className = "editavel";
            }

            for (let i = 0; i < categorias.length; i++) {
                categorias[i].setAttribute("contenteditable", "true");
                categorias[i].className = "editavel";
            }        
        } else if (editavel === false) {
            titulo.setAttribute("contenteditable", "true");
            titulo.className = "editavel";

            for (let i = 0; i < autores.length; i++) {
                autores[i].children[0].setAttribute("contenteditable", "true");
                autores[i].children[0].className = "editavel";
            }

            for (let i = 0; i < categorias.length; i++) {
                categorias[i].setAttribute("contenteditable", "true");
                categorias[i].className = "editavel";
            }
        }
    },

    // separar o escutar da função que altera? colocar um loop?
    escutar: function(path, titulo) {
        var idLivro = model.indice(path.id);
        
        titulo.addEventListener("input", 
        
            function(event) {
                var novoTitulo = event.target.innerText;
                console.log(novoTitulo)
                model.biblioteca[idLivro].titulo = novoTitulo;
            });

    },

    indice: function(id) {
        for (let i = 0; i < model.biblioteca.length; i++) {
            var indice = model.biblioteca[i].isbn.indexOf(id)
            if (indice === 0) {
                return i;
            }
        }
    }
}

var controller = {
    excluir: function(event) {
        
        // remove o livro do array
        var idLivro = event.composedPath()[3].id;
        model.biblioteca.splice(model.indice(idLivro), 1);

        // remove o livro da exibição
        var pai = document.getElementById("containerLivros");
        var filho = document.getElementById(idLivro)
        pai.removeChild(filho);
    },

    editar: function(event) {
        // envia o elemento html do evento clique para ativar a edição dos campos
        var path = event.composedPath()[3];
        //var idPath = path.target.id
        model.editavel(path, true);
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

    // verificar se devo deixar a função no onload ou inserir em outro local
    var nomeAntigo = document.getElementById("nome")
    nomeAntigo.addEventListener("input", function(event) {
       novoNome = event.target.innerText;
       model.nome = novoNome;
    })

    model.carregarLivros();
    model.ativarBotoes();
}