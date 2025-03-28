let string = "";
const buttons = document.querySelectorAll(".Button");

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const buttonText = e.target.innerHTML;

        if (buttonText === "=") {
            try {
                string = eval(string.replace("%", "/100"));
                document.querySelector(".input").value = string;
            } catch (error) {
                document.querySelector(".input").value = "Error";
            }
        } 
        else if (buttonText === "C") {
            string = "";
            document.querySelector(".input").value = string;
        }
        else if (buttonText === "⌫") {
            string = string.slice(0, -1);
            document.querySelector(".input").value = string;
        }
        else {
            string += buttonText;
            document.querySelector(".input").value = string;
        }
    });
});