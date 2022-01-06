var view = {
    // carrega o último livro da biblioteca
    adicionarLivro: function(indice) {
        var biblioteca = document.getElementById("containerLivros");
        var livro = document.createElement("article");

        if (indice === undefined) {
            indice = model.biblioteca.length - 1;   
        } 
    
        var capa = model.biblioteca[indice].capa;
        var titulo = model.biblioteca[indice].titulo;
        var isbn = model.biblioteca[indice].isbn;
        
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
        view.adicionarAutores(indice);
        view.adicionarCategorias(indice);
        model.ativarBotoes();
    },

    // carrega os autores do último livro
    adicionarAutores: function(indice) {
        var iAutores = model.biblioteca[indice].autores.length;
        for (let i = 0; i < iAutores; i++) {
            var autores = model.biblioteca[indice].autores[i];
            var listaAutores = document.getElementsByClassName("autores");
            var listaAutor = document.createElement("li");
            listaAutor.innerHTML = `<h3>${autores}</h3>`;
            listaAutores[indice].appendChild(listaAutor);
        }
    },

    // carrega as categorias do último livro
    adicionarCategorias: function(indice) {
        var iCategorias = model.biblioteca[indice].categorias.length;
        for (let i = 0; i < iCategorias; i++) {
            var categorias = model.biblioteca[indice].categorias[i];
            var listaCategorias = document.getElementsByClassName("categorias");
            var listaCategoria = document.createElement("li");
            listaCategoria.innerHTML = `${categorias}`;
            listaCategorias[indice].appendChild(listaCategoria);
        }        
    },

    // exibe a animação carregar
    exibirCarregar: function(status) {
        var carregar = document.getElementById("carregar");
        var container = document.getElementById("containerModal");
        if (status === true) {
            carregar.style.display = "block";
        } else if (status === false) {
            carregar.style.display = "none";
            container.style.display = "none";
        }
    },

    // exibe e esconde o menu ferramentas
    exibirFerramentas: function(event) {
        var botaoClicado = event.target.className;
        model.livroAtual(event);

        if (botaoClicado === "botaoAbrir") {
            model.livro.ferramentas.style.width = "80px";
            model.livro.botaoAbrir.style.display = "none";
            model.livro.botaoFechar.style.display = "block";
            view.esconderFerramentas();
        } else if (botaoClicado === "botaoFechar") {
            model.livro.ferramentas.style.width = "20px";
            model.livro.botaoAbrir.style.display = "block";
            model.livro.botaoFechar.style.display = "none";
            model.tornarEditavel(false);
        }
    },

    // esconde as ferramentas que não estao em evidência
    esconderFerramentas: function() {
        var livros = document.getElementsByClassName("item");

        for (let i = 0; i < livros.length; i++) {
            var conteudo = livros[i].children[2].children;
            var ferramentas = livros[i].children[0];
            var titulo = conteudo[0];
            var autores = conteudo[1].children;
            var categorias = conteudo[2].children;
            var botaoAbrir = ferramentas.children[1].children[0];
            var botaoFechar = ferramentas.children[1].children[1];
            
            if (livros[i].id !== model.livro.isbn) {
                ferramentas.style.width = "20px";
                botaoAbrir.style.display = "block";
                botaoFechar.style.display = "none";

                titulo.setAttribute("contenteditable", "false");
                titulo.className = "titulo";

                for (let i = 0; i < autores.length; i++) {
                    autores[i].children[0].setAttribute("contenteditable", "false");
                    autores[i].children[0].className = "";
                }

                for (let i = 0; i < categorias.length; i++) {
                    categorias[i].setAttribute("contenteditable", "false");
                    categorias[i].className = "";
                }
            }
        }
    },

    // exibe e esconde o menu pesquisa
    exibirPesquisa: function(event) {
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

    // esconde o menu pesquisa
    esconderPesquisa: function() {
        var pesquisar = document.getElementById("pesquisar");
        pesquisar.style.display = "none";
    },

    exibirErro: function(texto) {
        view.exibirCarregar(false);
        var container = document.getElementById("containerModal");
        var pesquisar = document.getElementById("pesquisar");
        var mensagem = document.getElementById("mensagem");

        container.style.display = "flex";
        pesquisar.style.display = "block";
        mensagem.innerHTML = texto;
    }
};

var model = {
    // nome da biblioteca
    nome: "Minha Biblioteca",

    // livros da biblioteca
    biblioteca: [ { titulo: "De primatas a astronautas",
                    autores: ["Leonard Mlodinow"],
                    categorias: ["Science"],
                    isbn: "9788537814697",
                    capa: "http://books.google.com/books/content?id=7xLUDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
                  { titulo: "De zero a um",
                    autores: ["Blake Masters", "Peter Thiel"],
                    categorias: ["Business & Economics"],
                    isbn: "9788539006373",
                    capa: "http://books.google.com/books/content?id=EtmxBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" }
                ],
    
    // livro atual para edição
    livro: { indice: "",
             titulo: "", 
             autores: "", 
             categorias: "", 
             isbn: "", 
             ferramentas: "", 
             botaoAbrir: "", 
             botaoFechar: "" },

    // salva o livro atual na propriedade livro
    livroAtual: function(event) {
        var path = event.composedPath()[3];
        this.livro.indice = model.indice(path.id);
        this.livro.titulo = path.children[2].children[0];
        this.livro.autores = path.children[2].children[1].children;
        this.livro.categorias = path.children[2].children[2].children;
        this.livro.isbn = path.id;
        this.livro.ferramentas = path.children[0];
        this.livro.botaoAbrir = path.children[0].children[1].children[0];
        this.livro.botaoFechar = path.children[0].children[1].children[1];
    },

    // pesquisa o livro na api do google
    pesquisarLivro: function() {
        var isbn = document.getElementById("inputIsbn");
        var link = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn.value;
        
        view.esconderPesquisa();
        view.exibirCarregar(true);

        fetch(link)
            .then(function(response) {
                if (response.ok || response.status === 200) {
                    return response.json();
                } else {
                    return view.exibirErro("Atenção! <br>Erro no servidor, <br>tente novamente.");
                }
            })

            .then(function(response) {
                var isbn = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
                
                if (model.indice(isbn) === undefined) {
                    return response;
                } else {
                    return view.exibirErro("Atenção! <br>Livro já existente <br>na sua biblioteca.");
                }
            })

            .then(function(response) {
                var titulo = response.items[0].volumeInfo.title;
                var autores = response.items[0].volumeInfo.authors;
                var categorias = response.items[0].volumeInfo.categories;
                var capa = response.items[0].volumeInfo.imageLinks.thumbnail;
                var isbn = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
                var livro = new Livro(titulo, autores, categorias, isbn, capa);
                model.biblioteca.push(livro);
                view.exibirCarregar(false);
                view.adicionarLivro();
            })

            .catch(function() {
                return view.exibirErro("Atenção! <br>Verifique o ISBN do Livro <br> e tente novamente.");
            });

    },

    // carrega os livros da bibloteca
    carregarLivros: function() {
        for (let i = 0; i < this.biblioteca.length; i++) {
            view.adicionarLivro(i);
        }
    },

    // carrega o título da bibloteca
    carregarTitulo: function() {
        var titulo = document.getElementById("titulo")
        titulo.innerText = this.nome;
    },

    // ativa os botões
    ativarBotoes: function() {
        var botoesExcluir = document.getElementsByClassName("botaoExcluir");
        var botoesEditar = document.getElementsByClassName("botaoEditar");
        var botoesAbrir = document.getElementsByClassName("botaoAbrir");
        var botoesFechar = document.getElementsByClassName("botaoFechar");
        
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

            model.alterarTexto();

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

    // salva o texto ao editar o livro
    alterarTexto: function() {

        this.livro.titulo.addEventListener("input", function() {
            model.biblioteca[model.livro.indice].titulo = model.livro.titulo.innerText;
        });

        for (let i = 0; i < this.livro.autores.length; i++) {
            this.livro.autores[i].addEventListener("input", function() {
                model.biblioteca[model.livro.indice].autores[i] = model.livro.autores[i].innerText;
            })            
        };

        for (let i = 0; i < this.livro.categorias.length; i++) {
            this.livro.categorias[i].addEventListener("input", function() {
                model.biblioteca[model.livro.indice].categorias[i] = model.livro.categorias[i].innerText;
            })            
        };
    },
    
    // retorna o indice do livro pesquisado
    indice: function(id) {
        for (let i = 0; i < model.biblioteca.length; i++) {
            var indice = model.biblioteca[i].isbn.indexOf(id);
            if (indice === 0) {
                return i;
            }
        }
    }
}

var controller = {
    // remove o livro da exibição e biblioteca        
    excluir: function() {
        model.biblioteca.splice(model.indice(model.livro.isbn), 1);

        var pai = document.getElementById("containerLivros");
        var filho = document.getElementById(model.livro.isbn)
        pai.removeChild(filho);
    },

    // verificar onde colocar o tornarEditável
    editar: function() {
        model.tornarEditavel(true);
    }
}

// função construtora do objeto livro
function Livro(titulo, autores, categorias, isbn, capa) {
        this.titulo = titulo;
        this.autores = autores;
        this.categorias = categorias;
        this.isbn = isbn;
        this.capa = capa;
}

// carrega os livros cadastrados e ativa o botão de pesquisa
window.onload = function() {
        var botaoPesquisarLivro = document.getElementById("pesquisarLivro");
        var botaoExibirPesquisa = document.getElementById("exibirPesquisa")
        var botaoEsconderPesquisa = document.getElementById("containerModal")
        var alterarTitulo = document.getElementById("titulo")

        botaoPesquisarLivro.addEventListener("click", model.pesquisarLivro);
        botaoExibirPesquisa.addEventListener("click", view.exibirPesquisa);
        botaoEsconderPesquisa.addEventListener("click", view.exibirPesquisa);
        alterarTitulo.addEventListener("input", function() {
            model.nome = this.innerText;
        });

    model.carregarLivros();
    model.carregarTitulo();
}