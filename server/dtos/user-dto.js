module.exports = class UserDto {
    id;
    name;
    surname;
    roles;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.surname = model.surname;
        this.roles = model.roles;
    }
}
