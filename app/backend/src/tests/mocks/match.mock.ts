const match = {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: false,
    homeTeam: {
        teamName: "São Paulo"
    },
    awayTeam: {
        teamName: "Grêmio"
    }
};

const matches = [
    {
        id: 1,
        homeTeamId: 16,
        homeTeamGoals: 1,
        awayTeamId: 8,
        awayTeamGoals: 1,
        inProgress: true,
        homeTeam: {
            teamName: "São Paulo"
        },
        awayTeam: {
            teamName: "Grêmio"
        }
    },
    {
        id: 2,
        homeTeamId: 10,
        homeTeamGoals: 2,
        awayTeamId: 7,
        awayTeamGoals: 0,
        inProgress: false,
        homeTeam: {
            teamName: "Flamengo"
        },
        awayTeam: {
            teamName: "Internacional"
        }
    },
];

const newMatch = {
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
}

const createdMatch = {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: true,
}

const invalidNewMatch = {
    homeTeamId: 1,
    homeTeamGoals: 2,
    awayTeamId: 1,
    awayTeamGoals: 1,
}

const matchWithInvalidTeam = {
    homeTeamId: 9999,
    homeTeamGoals: 2,
    awayTeamId: 1,
    awayTeamGoals: 1,
}

export default {
    match,
    matches,
    newMatch,
    createdMatch,
    invalidNewMatch,
    matchWithInvalidTeam,
}