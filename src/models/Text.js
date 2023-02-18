class Text {
    static async removeMarkdown(text) {
        return text.replace(/(\*|_|`)/g, "");
    }

    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace("intent", "") // Remove intent name
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w-]+/g, "") // Remove all non-word chars
            .replace(/--+/g, "-") // Replace multiple - with single -
            .replace(/^-+/, "") // Trim - from start of text
            .replace(/-+$/, ""); // Trim - from end of text
    }

    static capitalizeFirstLetter(text) {
        if (text && typeof text === "string") {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        return text;
    }
}

module.exports = Text;
