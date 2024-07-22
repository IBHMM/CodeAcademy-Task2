import User from './classes.mjs';

const tbody = document.querySelector("#user-table-body");
const htmlpages = document.querySelector("#pagination-info");
const input = document.querySelector("#search-input");
let users = [];
let pages = 0;
let currentpage = 1;
let searching = '';
const maxpeople = 5;
const add = document.querySelector("#add");
const save = document.querySelector("#saveButton");


const name_ = document.querySelector("#name");
const address = document.querySelector("#address");
const email = document.querySelector("#email");
const phone_number = document.querySelector("#phone_number");
const job = document.querySelector("#job");
const company = document.querySelector("#company");
const birthday = document.querySelector("#birthdate");
const close = document.querySelector("#close");

add.addEventListener("click", e => {
    name_.value = ""
    address.value = ""
    email.value = ""
    phone_number.value = ""
    job.value = ""
    company.value = ""
    birthday.value = ""

    save.addEventListener("click", () => {
            const n = name_.value;
            const addr = address.value;
            const em = email.value;
            const ph = phone_number.value;
            const jo = job.value;
            const com = company.value;
            const bir = birthday.value;
        
            if (n && addr && em && ph && jo && com && bir) {
                const newuser = new User(n, bir, em, ph, jo, com, addr);
                users.push(newuser);
                SetTable(users);
            }
    })
});

function createEditButton(user) {
    const editButton = elementCreater("button");
    editButton.type = "button";
    editButton.className = "btn btn-primary";
    editButton.textContent = "Edit";
    
    editButton.setAttribute("data-toggle", "modal");
    editButton.setAttribute("data-target", "#editPersonModal");
    
    editButton.addEventListener("click", () => {
        populateEditModal(user);
    });

    return editButton;
}

const prev = document.querySelector("#previous-button");
const next = document.querySelector("#next-button");

function elementCreater(name) {
    return document.createElement(name);
}

async function TakeData() {
    try {
        const response = await fetch('http://localhost:3000/users');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch(err) {
        console.error(err);
        return [];
    }
}

async function PopulatePerson() {
    const data = await TakeData();
    users.push(...data.map(per => new User(
        per.name, 
        per.birthdate,
        per.email,
        per.phone_number,
        per.job,
        per.company,
        per.address
    )));
    pages = Math.ceil(users.length / maxpeople);
}

function searchPerson(search) {
    if (!search) {
        return users; 
    }
    
    search = search.toLowerCase();
    return users.filter(user => 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) || 
        user.job.toLowerCase().includes(search) || 
        user.address.toLowerCase().includes(search) || 
        user.company.toLowerCase().includes(search)
    );
}

async function deletePerson(person) {
    const index = users.findIndex(user => user.id == person.id);

    if (index !== -1) {
        users.splice(index, 1);
        alert("User Deleted");
        SetTable(users);
    }
}   

function editperson(person) {
    const index = users.findIndex(user => user.id == person.id);

    const n = name_.value;
    const addr = address.value;
    const em = email.value;
    const ph = phone_number.value;
    const jo = job.value;
    const com = company.value;
    const bir = birthday.value;

    if (n && addr && em && ph && jo && com && bir) {
        const updatedUser = new User(n, bir, em, ph, jo, com, addr);
        users[index] = updatedUser; 
        close.click();
        SetTable(users);
    }
}   

function populateEditModal(user) {
    name_.value = user.name;
    address.value = user.address;
    email.value = user.email;
    phone_number.value = user.phone_number;
    job.value = user.job;
    company.value = user.company;
    birthday.value = user.birthdate;

    editperson(user);
}

function SetTable(displayUsers) {
    tbody.innerHTML = "";
    const totalPages = Math.ceil(displayUsers.length / maxpeople);
    htmlpages.innerText = `Page ${currentpage} of ${totalPages}`;
    const start = (currentpage - 1) * maxpeople;
    const end = start + maxpeople;
    
    displayUsers.slice(start, end).forEach(user => {
        const tr = elementCreater("tr");
        const row = {
            name: user.name,
            address: user.address,
            email: user.email,
            phone_number: user.phone_number,
            job: user.job,
            company: user.company,
            age: user.calculateAge(),
            retired: user.isRetired(),
        };
        
        Object.values(row).forEach(value => {
            const td = elementCreater("td");
            td.innerText = value;
            tr.append(td);
        });

        const td1 = elementCreater("td");
        const td2 = elementCreater("td");
        
        const delbutton = elementCreater("button");
        delbutton.innerText = "Delete";
        delbutton.classList.add("btn", "btn-danger");

        const editbutton = createEditButton(user);

        td1.append(delbutton);
        td2.append(editbutton);
        
        delbutton.addEventListener("click", () => {
            deletePerson(user);
        });

        editbutton.addEventListener("click", () => {
            populateEditModal(user);
        });

        tr.append(td1, td2);
        tbody.append(tr);
    });

    prev.disabled = currentpage === 1;
    next.disabled = currentpage === totalPages;
}

window.onload = async function () {
    await PopulatePerson();
    SetTable(users);
}

next.addEventListener("click", () => {
    if (currentpage < pages) {
        currentpage++;
        SetTable(searchPerson(searching));
    }
});

prev.addEventListener("click", () => {
    if (currentpage > 1) {
        currentpage--;
        SetTable(searchPerson(searching));
    }
});

input.addEventListener("input", e => {
    searching = e.target.value;
    const searchResults = searchPerson(searching);
    currentpage = 1;
    pages = Math.ceil(searchResults.length / maxpeople);
    SetTable(searchResults);
});
