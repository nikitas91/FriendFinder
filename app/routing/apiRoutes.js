const path = require("path");
const friends = require("../data/friends");

module.exports = function (app) {
    app.get("/api/friends", function (req, res) {
        res.json(friends);
    });

    app.post("/api/friends", function (req, res) {
        let userObject = req.body;
        let userSurveyResponses = userObject.scores;

        //  Run a check to see if user already exists
        let userFound = false;
        for (let i = 0; i < friends.length; i++) {
            if (userObject.name.toLowerCase() === friends[i].name.toLowerCase()) {
                userFound = true;
                break;
            }
        }

        if (userFound) {
            res.json({ error: true, errorMessage: "User already exists!" });
        }
        else {
            let userMatchName = "";
            let userMathImage = "";
            let lowestDifference = 0;

            for (let i = 0; i < friends.length; i++) {
                let computedDifference = 0;

                for (let j = 0; j < userSurveyResponses.length; j++) {
                    computedDifference += Math.abs(friends[i].scores[j] - userSurveyResponses[j]);
                }

                if (!lowestDifference || (computedDifference < lowestDifference)) {
                    lowestDifference = computedDifference;
                    userMatchName = friends[i].name;
                    userMathImage = friends[i].photo;
                }
            }

            friends.push(userObject);

            res.json({ matchName: userMatchName, matchImage: userMathImage });
        }
    });
};