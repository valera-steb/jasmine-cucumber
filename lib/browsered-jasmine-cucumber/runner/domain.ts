import {IStepModel} from "../cucumber/Model";
import {IStep, stepsOrder} from "./ScenarioMethodsProvider";

const levelMap = {
    'background': 'b',
    'group': 'g',
    'feature': 'f'
};

export function findStepFn(step: IStepModel, stepsList: IStep[]) {
    var candidates = stepsList;
    if (step.from) {
        const level = levelMap[step.from];
        candidates = candidates.filter(x => x.from === level);
    }

    const found = candidates
        .map(x => {
            const r = x.step.pattern.exec(step.description);
            return {
                d: x,
                arguments: r ? r.slice(1) : [],
                match: !!r
            };
        })
        .filter(x => x.match);


    if (found.length < 1)
        throw new Error(
            `Missing step definitions ${step.from ? 'from ' + step.from : ''}: ${stepWithLikelyMatch(step.description, candidates)}`
        );

    if (found.length > 1 && found[0].d.from === found[1].d.from)
        throw new Error('Found many');


    return found[0];
}


function stepWithLikelyMatch(unknownDescription, stepsDefinitions: IStep[]) {
    console.log(stepsDefinitions);

    var candidates = stepsDefinitions
        .map(x => x.step.description)
        .filter(onlyUnique)
        .map(function (knownDescription) {
            return {
                description: knownDescription,
                score: levenshteinDistance(unknownDescription, knownDescription)
            };
        })
        .sort(function (l, r) {
            return l.score - r.score;
        })
        .map(function (item) {
            return item.description + ' (' + item.score + ')';
        })
        .slice(0, 5);
    return unknownDescription + '\n\t\tDid you mean?\n\t\t\t' + candidates.join('\n\t\t\t');
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function mapDescription(step) {
    return step.description;
}


function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}
