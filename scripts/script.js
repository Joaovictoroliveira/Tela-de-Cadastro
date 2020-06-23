class Validator {
    constructor() {
        this.validations = [
            'data-required',
            'data-min-length',
            'data-max-length',
            'data-email-validate',
            'data-only-letters',
            'data-equal',
            'data-password-validate',
        ]
    }

    // iniciar a validação de todos os campos
    validate(form) {

        // resgata todas as validações
        let currentValidations = document.querySelectorAll('form .error-validation');

        if(currentValidations.length > 0) {
            this.cleanValidations(currentValidations);
        }


        // pegar os inputs 
        let inputs = form.getElementsByTagName('input');

        // transformo uma HTML collection -> array
        let inputsArray = [...inputs];

        // loop nos inputs e validação mediante ao que for encontrado
        inputsArray.forEach(function(input) {

            // loop em todas as validações existentes
            for(let i = 0; this.validations.length > i; i++) {
                // verifica se a validação atual existe no input
                if(input.getAttribute(this.validations[i]) != null) {
                    // limpando a string para virar um método
                    let method = this.validations[i].replace('data-', '').replace('-', '');

                    // valor do input
                    let value = input.getAttribute(this.validations[i]);

                    // invocar o método
                    this[method](input, value);
                }
            }
        }, this);
    }

    // verifica se um input tem um numero minimo de caracteres
    minlength(input, minValue) {
        let inputlength = input.value.length;
        let erroMessage = `O campo precisa ter pelo menos ${minValue} caracteres`;

        if(inputlength < minValue) {
            this.printMessage(input, erroMessage);
        }
    }

    // verifica se um input passou do limite de caracteres
    maxlength(input, maxValue) {
        let inputlength = input.value.length;

        let erroMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

        if(inputlength > maxValue) {
            this.printMessage(input, erroMessage);
        }
    }

    // valida emails
    emailvalidate(input) {

        // email@email.com -> email@email.com.br
        let re = /\S+@\S+\.\S+/;

        let email = input.value;

        let erroMessage = `Insira um email no padrão joao@gmail.com`;

        if(!re.test(email)) {
            this.printMessage(input, erroMessage);
        }
    }

    // valida se o campo tem apenas letras
    onlyletters(input) {
        let re = /^[A-Za-z]+$/;

        let inputValue = input.value;

        let erroMessage = `Este campo não aceita números nem caracteres especiais`;

        if(!re.test(inputValue)) {
            this.printMessage(input, erroMessage);
        }
    }

    // verifica se dois campos são iguais
    equal(input, inputName) {
        let inputToCompare = document.getElementsByName(inputName)[0];

        let erroMessage = `Este campo precisa estar igual ao ${inputName}`;

        if(input.value != inputToCompare.value) {
            this.printMessage(input, erroMessage);
        }
    }

    // valida campo de senha
    passwordvalidate(input) {

        // transformar string em array
        let charArr = input.value.split("");

        let upperCase = 0;
        let numbers = 0;

        for(let i = 0; charArr.length > i; i++) {
            if(charArr[i] === charArr[i].toUpperCase() && isNaN(parseInt(charArr[i]))) {
                upperCase++;
            } else if(!isNaN(parseInt(charArr[i]))) {
                numbers++;
            }
        }

        if(upperCase === 0 || numbers === 0) {
            let erroMessage = `A senha precisa de um caractere maiúsculo e um número`;

            this.printMessage(input, erroMessage);
        }

    }

    // limpa as validações da teça
    cleanValidations(validations) {
        validations.forEach(el => el.remove());
    }

    // imprimir mensagem de erro na tela
    printMessage(input, msg) {  

        // quantidade de erros
        let errorQty = input.parentNode.querySelector('.error-validation');

        if(errorQty === null) {
            let template = document.querySelector('.error-validation').cloneNode(true);
            template.textContent = msg;

            let inputParent = input.parentNode;
            template.classList.remove('template');
            inputParent.appendChild(template);
        }
    }

    // verifica se o input é requirido
    required(input) {
        let inputValue = input.value;

        if(inputValue == '') {
            let erroMessage = `Este campo é obrigatório`;
            this.printMessage(input, erroMessage);
        }
    }

}

let form = document.getElementById("register-form");
let submit = document.getElementById("btn-submit");

let validator = new Validator();

// evento que dispara as validações
submit.addEventListener('click', function(e) {
    e.preventDefault();
    validator.validate(form);
});