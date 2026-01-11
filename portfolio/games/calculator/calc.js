let expression = ""
let buttons = document.querySelectorAll('button')
let display = document.getElementById('display')

buttons.forEach(function (buttons) {
    buttons.addEventListener('click', function () {
        let value = buttons.textContent;

        if (value === "=") {
            try {
                expression = eval(expression);
            } catch {
                expression = 'error'
            }
        } else if (value === "C") { expression = "" } else { expression += value }
        display.value = expression;
        console.log(value)
    }) 
}
)
