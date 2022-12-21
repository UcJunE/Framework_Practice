const bookshelf = require("../bookshelf");
// depends on the relationship - if 1- 1  =singular , if 1 to many - plural
const Poster = bookshelf.model("Poster", {
  tableName: "posters",
  category() {
    return this.belongsTo("Category");
  },
  tags() {
    return this.belongsToMany("Tag");
  },
});

const Tag = bookshelf.model("Tag", {
  tableName: "tags",
  posters() {
    return this.belongsToMany("Poster");
  },
});

const Category = bookshelf.model("Category", {
  tableName: "categories",
  posters() {
    return this.hasMany("Poster");
  },
});

module.exports = { Poster, Tag, Category };
