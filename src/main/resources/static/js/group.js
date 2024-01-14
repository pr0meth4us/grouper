document.addEventListener('DOMContentLoaded', function() {
    let hide = document.getElementsByClassName("groupSize");
    for (let i = 0; i < hide.length; i++) {
        hide[i].style.display = "none";
    }
    let hide2 = document.getElementsByClassName("numberOfGroups");
    for (let i = 0; i < hide2.length; i++) {
        hide2[i].style.display = "none";
    }
});
function display() {
    let choice1 = document.getElementById("choice1");
    let choice2 = document.getElementById("choice2");
    let elements1 = document.getElementsByClassName("groupSize");
    let elements2 = document.getElementsByClassName("numberOfGroups");

    if (choice1.checked) {
        showHideElements(elements1, elements2);
    } else if (choice2.checked) {
        showHideElements(elements2, elements1);
    }

    console.log("triggered");

    function showHideElements(toShow, toHide) {
        for(let el of toShow) el.style.display = "block";
        for(let el of toHide) el.style.display = "none";
    }
}

