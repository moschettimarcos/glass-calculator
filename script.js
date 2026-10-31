const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let justCalculated = false;

function format(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "Error";
    return number.toLocaleString("en-US", { maximumFractionDigits: 10 })
}

function render() {
    currentEl.textContent = current.endsWith(".")
    ? format(current) + "."
    : format(current);

    previousEl.textContent = operator ? `${format(previous)} ${operator}` : "";
    
    document.querySelectorAll(".op").forEach((button) => {
        button.classList.toggle(
            "active",
            button.dataset.op === operator && current === "0",
        );
    });
}

function inputNumber(digit) {
    if (justCalculated) {
        current = "0";
        justCalculated = false;
    }
    if (digit === "." && current.includes(".")) return;
    if (current.replace("-", "").replace(".","").length >= 12) return;

    current = current === "0" && digit !== "." ? digit : current + digit;
}

function calculate(a, b, op) {
   switch (op) {
    case "+":
        return a + b;
    case "-":
        return a - b;
    case "x":
        return a * b;
    case "÷":
        return b === 0 ? NaN : a / b;
   } 
}

function chooseOperator(op) {
    if(operator && !justCalculated && current !== "0") {
        current = String(calculate(Number(previous), Number(current), operator));
    }
    previous = current;
    operator = op;
    current = "0";
    justCalculated = false;
}

function equals() {
    if (!operator) return;
    const result = calculate(Number(previous), Number(current), operator);
    current = String(parseFloat(result.toPrecision(12)));
    previous = null;
    operator = null;
    justCalculated = true;
}

function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    justCalculated = false;
}

function deleteLast() {
    if (justCalculated) return clearAll();
    current = current.length > 1 ? current.slice(0, -1) : "0";
    if (current === "-") current = "0";
}

function percent() {
    current = String(Number(current) / 100);
}

keys.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const { number, op, action } = button.dataset;

    if (number) inputNumber(number);
    if (op) chooseOperator(op);
    if (action === "equals") equals();
    if (action === "clear") clearAll();
    if (action === "delete") deleteLast();
    if (action === "percent") percent();

    render();
});

document.addEventListener("keydown", (event) => {
    const operators = { "+": "+", "-": "-", "*": "x", "/": "÷" };

    if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
    else if (event.key === ".") inputNumber(".");
    else if (operators[event.key]) chooseOperator(operators[event.key]);
    else if (event.key === "Enter" || event.key === "=") equals();
    else if (event.key === "Backspace") deleteLast();
    else if (event.key === "Escape") clearAll();
    else return;

    event.preventDefault();
    render();
});

render();







