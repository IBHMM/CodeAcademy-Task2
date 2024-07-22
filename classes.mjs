class Person {
    age;
    retired;

    constructor(name, birthdate, email, phone_number, job, company, address) {
        if (new.target === Person) {
            throw new Error("It is an Abstract class");
        }

        this.name = name;
        this.address = address;
        this.birthdate = birthdate;
        this.email = email;
        this.phone_number = phone_number;
        this.job = job;
        this.company = company;
        this.age = this.calculateAge();
        this.retired = this.isRetired();
    }

    calculateAge() {
        const currentYear = new Date().getFullYear();
        const birthYear = this.birthdate.slice(0,4);
        return currentYear - birthYear;
    }

    isRetired() {
        return this.age > 65;
    }
}

export default class User extends Person {
    constructor(name, birthdate, email, phone_number, job, company, address) {
        super(name, birthdate, email, phone_number, job, company, address);
        this.id = Math.floor((Math.random() * 100000000000) + 1)
    }
}
