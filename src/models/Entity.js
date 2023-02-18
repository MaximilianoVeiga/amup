class Entity {
    static generate() {
        const defaultEntities = [];

        defaultEntities.push({
            name: "date",
            type: "time",
            data: [
                "hoje",
                "amanhã",
                "depois de amanhã",
                "ontem",
                "anteontem",
                "semana que vem",
                "semana passada",
                "mês que vem",
                "mês passado",
                "ano que vem",
                "ano passado",
            ],
        });

        defaultEntities.push({
            name: "time",
            type: "time",
            data: [
                "0:00",
                "1:00",
                "2:00",
                "3:00",
                "4:00",
                "5:00",
                "6:00",
                "7:00",
                "8:00",
                "9:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00",
                "24:00",
            ],
        });

        defaultEntities.push({
            name: "day",
            type: "time",
            data: [
                "domingo",
                "segunda",
                "terça",
                "quarta",
                "quinta",
                "sexta",
                "sábado",
            ],
        });

        defaultEntities.push({
            name: "month",
            type: "time",
            data: [
                "janeiro",
                "fevereiro",
                "março",
                "abril",
                "maio",
                "junho",
                "julho",
                "agosto",
                "setembro",
                "outubro",
                "novembro",
                "dezembro",
            ],
        });

        defaultEntities.push({
            name: "year",
            type: "time",
            data: [
                "2020",
                "2021",
                "2022",
                "2023",
                "2024",
                "2025",
                "2026",
                "2027",
                "2028",
                "2029",
                "2030",
            ],
        });

        defaultEntities.push({
            name: "number",
            type: "number",
            data: [
                "um",
                "dois",
                "três",
                "quatro",
                "cinco",
                "seis",
                "sete",
                "oito",
                "nove",
                "dez",
                "onze",
                "doze",
                "treze",
                "catorze",
                "quinze",
                "dezesseis",
                "dezessete",
                "dezoito",
                "dezenove",
                "vinte",
                "trinta",
                "quarenta",
                "cinquenta",
                "sessenta",
                "setenta",
                "oitenta",
                "noventa",
                "cem",
                "cento",
                "mil",
            ],
        });

        return defaultEntities;
    }
}

module.exports = Entity;
