module.exports = {
    pathRequiresQuotes(path)
    {
        const triggerCharacters = "\\/ \t\n\r\v";

        for(character in path)
        {
            if (triggerCharacters.indexOf(character) != -1)
                return true;
        }
        return false;
    }
}