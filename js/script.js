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
                    <input type="button" class="botaoAbrir" value="&#10094;">
                    <input type="button" class="botaoFechar" value="&#10095;">
                </div>
            </div>
            <div class="capa">
                <img src="${capa}">
            </div>
            <div class="conteudo">
                <h2 class="titulo">${titulo}</h2>
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

    exibirCarregando: function(status) {
        var carregar = document.getElementById("carregar");
        var container = document.getElementById("containerModal");
        if (status === true) {
            carregar.style.display = "block";
            container.style.display = "flex";
        } else if (status === false) {
            carregar.style.display = "none";
            container.style.display = "none";
        }
    },

    exibirFerramentas: function(event) {
        model.livroAtual(event);
        var status = event.target.className;
        if (status === "botaoAbrir") {
            model.livro.ferramentas.style.width = "90px";
            model.livro.botaoAbrir.style.display = "none";
            model.livro.botaoFechar.style.display = "block";
        } else if (status === "botaoFechar") {
            model.livro.ferramentas.style.width = "30px";
            model.livro.botaoAbrir.style.display = "block";
            model.livro.botaoFechar.style.display = "none";
            model.tornarEditavel(false);
        }
    },

    exibirEsconderPesquisa: function(event) {
        var status = event.target.id;
        var container = document.getElementById("containerModal");
        var pesquisar = document.getElementById("pesquisar");

        if (status === "exibirPesquisa") {
            container.style.display = "flex";
            pesquisar.style.display = "block";
        } else if (status === "esconderPesquisa" || status === "containerModal") {
            pesquisar.style.display = "none";
            container.style.display = "none";
        }
    },

    esconderPesquisa: function() {
        var pesquisar = document.getElementById("pesquisar");
        pesquisar.style.display = "none";
    }
};

var model = {
    nome: "Minha Biblioteca",
    biblioteca: [],
    livro: {titulo: "", autores: "", categorias: "", isbn: "", ferramentas: "", botaoAbrir: "", botaoFechar: ""},

    // salva o livro atual na propriedade livro
    livroAtual: function(event) {
        var path = event.composedPath()[3];
        var indice = model.indice(path.id);

        this.livro.titulo = path.children[2].children[0];
        this.livro.autores = path.children[2].children[1].children;
        this.livro.categorias = path.children[2].children[2].children;
        this.livro.isbn = path.id;
        this.livro.ferramentas = path.children[0];
        this.livro.botaoAbrir = path.children[0].children[1].children[0];
        this.livro.botaoFechar = path.children[0].children[1].children[1];

    },

    pesquisarLivro: function() {
        var isbn = document.getElementById("inputISBN");
        var link = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn.value;
        
        view.esconderPesquisa();
        view.exibirCarregando(true);

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
                view.exibirCarregando(false);
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
            botoesAbrir[i].onclick = view.exibirFerramentas;
            botoesFechar[i].onclick = view.exibirFerramentas;
        }
    },

    // torna os campos do livro atual editaveis
    tornarEditavel: function(status) {

        if (status === true) {
            this.livro.titulo.setAttribute("contenteditable", "true");
            this.livro.titulo.className = "titulo editavel";

            for (let i = 0; i < this.livro.autores.length; i++) {
                this.livro.autores[i].children[0].setAttribute("contenteditable", "true");
                this.livro.autores[i].children[0].className = "editavel";
            }

            for (let i = 0; i < this.livro.categorias.length; i++) {
                this.livro.categorias[i].setAttribute("contenteditable", "true");
                this.livro.categorias[i].className = "editavel";
            }
            
            //model.alterarTexto(titulo, indice);
            
            /*for (let i = 0; i < autores.length; i++) {
                model.alterarTexto(nodeAutores, autores[i].children[0], indice);                
            }
            /*for (let i = 0; i < categorias.length; i++) {
                model.alterarTexto(categorias[i], indice);         
            }*/       

        } else if (status === false) {
            this.livro.titulo.setAttribute("contenteditable", "false");
            this.livro.titulo.className = "titulo";

            for (let i = 0; i < this.livro.autores.length; i++) {
                this.livro.autores[i].children[0].setAttribute("contenteditable", "false");
                this.livro.autores[i].children[0].className = "";
            }

            for (let i = 0; i < this.livro.categorias.length; i++) {
                this.livro.categorias[i].setAttribute("contenteditable", "false");
                this.livro.categorias[i].className = "";
            }
        }
    },

    alterarTexto: function(node, campo, indice) {

        console.log(node);
        
        for (let i = 0; i < node.length; i++) {
            node[i].indice = i;
            node[i].addEventListener("input", function() {
                console.log(this.indice + 1)
            })
        }

        /*campo.addEventListener("input", function(event) {
                  
        })*/

        /*var indiceCampo = event.target.classList[0]
        var novoCampo = event.target.innerText;

        if (indiceCampo === "titulo") {
            model.biblioteca[indice].titulo = novoCampo;
        } else if (indiceCampo === "autores") {
            model.biblioteca[indice].autores = novoCampo;
        } else if (indiceCampo === "categorias") {
            model.biblioteca[indice].categorias = novoCampo;
        }*/
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
        model.biblioteca.splice(model.indice(model.livro.isbn), 1);

        // remove o livro da exibição
        var pai = document.getElementById("containerLivros");
        var filho = document.getElementById(model.livro.isbn)
        pai.removeChild(filho);
    },

    // recebe o evento clique do botao editar e envia o caminho dos campos editaveis para model.editavel
    editar: function(event) {
        // envia o elemento html do evento clique para ativar a edição dos campos
        //var path = event.composedPath()[3];
        //var idPath = path.target.id
        model.tornarEditavel(true);
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
        var botaoPesquisarLivro = document.getElementById("pesquisarLivro");
        var botaoExibirPesquisa = document.getElementById("exibirPesquisa")
        var botaoEsconderPesquisa = document.getElementById("containerModal")

        //deixar aqui ou deixar em ativarBotoes?
        botaoPesquisarLivro.addEventListener("click", model.pesquisarLivro);
        botaoExibirPesquisa.addEventListener("click", view.exibirEsconderPesquisa);
        botaoEsconderPesquisa.addEventListener("click", view.exibirEsconderPesquisa);

    model.carregarLivros();
    model.ativarBotoes();
}