var excercises_list;
const xhttp = new XMLHttpRequest();
xhttp.onload = function () {
    excercises_list = JSON.parse(this.responseText);

}
xhttp.open("GET", "excercises_json", true);
xhttp.send();
document.addEventListener('DOMContentLoaded', async function () {



    document.getElementById("add_day").addEventListener("click", function () {
        document.getElementById("excercise_days_holder").appendChild(addTrainingDay())
    })



}, false);

function addTrainingDay() {
    var container = document.createElement("div")
    container.className = "traing_day"

    var nameInput = document.createElement("input")
    nameInput.placeholder = "Add name of training day like(A,B,Leg day, etc.)"
    nameInput.type = "text"
    container.appendChild(nameInput)

    var addExcerciseButton = document.createElement("button")
    addExcerciseButton.value = "Add next excercise";
    addExcerciseButton.textContent = "Add next excercise"
    addExcerciseButton.addEventListener("click", function () {
        this.parentElement.appendChild(addExcercise())
    });
    container.appendChild(addExcerciseButton)

    var submitAll = document.createElement("button")
    submitAll.value = "Save training day";
    submitAll.textContent = "Save training day"
    container.appendChild(submitAll)

    var deleteButton = document.createElement("button")
    deleteButton.type = "submit"
    deleteButton.value = "Delete training day"
    deleteButton.textContent = "Delete training day"
    deleteButton.addEventListener("click", function () {
        this.parentElement.remove();
    })
    container.appendChild(deleteButton)
    return container;
}

function addExcercise() {
    var container = document.createElement("div");
    container.className = "excercise_container";


    var image = document.createElement("img")
    image.class = "exercise_image";
    container.appendChild(image)
    //"/exercises/' + excercise.name.toString().replaceAll(" ", "_").replaceAll("/", "_") + '/images/0.jpg"/>
    var select = document.createElement("select");
    select.id = "exercises_select"
    console.log(excercises_list)
    for (var excercise of excercises_list.exercises) {
        var option_excercise = document.createElement("option");
        option_excercise.innerHTML = excercise.name
        option_excercise.value = excercise.name
        select.appendChild(option_excercise);
    }


    select.addEventListener("mouseover", function () {
        console.log(this)
        this.parentElement.children[0].src = '/exercises/' + select.value.toString().replaceAll(" ", "_").replaceAll("/", "_") + '/images/0.jpg'
    })

    container.appendChild(select)
    select.className = "excercises_select";

    var sets = document.createElement("input")
    sets.type = "number"
    sets.placeholder = "Nuber of sets"

    var reps = document.createElement("input")
    reps.type = "number"
    reps.placeholder = "Nuber of reps per set"

    var deleteButton = document.createElement("button")
    deleteButton.type = "submit"
    deleteButton.value = "Delete excercise"
    deleteButton.textContent = "Delete excercise"

    container.appendChild(sets)
    container.appendChild(reps)
    container.appendChild(deleteButton)
    deleteButton.addEventListener("click", function () {
        console.log(this)
        this.parentElement.remove();
    })


    return container;
}