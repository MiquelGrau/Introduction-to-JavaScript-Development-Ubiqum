function auxGenerator(aux, aux2, aux3, partyVotes, party) {
    var ui = 0;
    while (ui < partyVotes.length) {
        aux[ui] = partyVotes[ui];
        aux2[ui] = partyVotes[ui];
        aux3[ui] = party[ui];
        ui++;
    }
}

function auxValueMin(party, aux, partyM) {
    var lengthVap = parseFloat(parseFloat(party.length) * 0.1).toFixed(0); // 10% of democrats.lentgh
    var minimumVap = aux[lengthVap]; // cant be bigger than this value
    var j = 0;
    while (aux[j] < minimumVap) {
        partyM[j] = aux[j];
        j++;
    }
}

function auxValueMax(party, aux, partyM) {
    var lengthVap = parseFloat(parseFloat(party.length) * 0.1).toFixed(0); // 10% of democrats.lentgh
    var minimumVap = aux[lengthVap]; // cant be bigger than this value
    var j = 0;
    while (aux[j] > minimumVap) {
        partyM[j] = aux[j];
        j++;
    }
}

function auxOftenVote(aux2, aux3, partyMv, partyMn) {
    var di = 0;
    var dj = 0;
    while (partyMn.length < partyMv.length) {
        while (dj < partyMv.length) {
            if (partyMv[dj] == aux2[di]) {
                partyMn[dj] = aux3[di];
                aux2.splice(di, 1);
                aux3.splice(di, 1);
                dj++;
                di = 0;
            } else {
                di++;
            }
        }
        di = 0;
        dj++;
    }
}

function tableGenerator(partyMN, partyMV, output) {
    var addOutput = 0;
    while (addOutput < partyMN.length) {
        output += "<tr><td>" + partyMN[addOutput] + "</td><td>" + partyMV[addOutput] + "</td></tr>";
        addOutput++;
    }
    return output;
}


$(function () {
    // Variables
    var statistics = {
        "numberDemocrats": 0,
        "numberRepublicans": 0,
        "numberIndependents": 0,
        "democratsAverage": 0,
        "republicansAverage": 0,
        "democratMvdv": [], //democratMembersVoteDisagreeValue
        "democratMvdn": [], //democratMembersVoteDisagreeName
        "democratMvav": [], //democratMembersVoteAgreeValue
        "democratMvan": [], //democratMembersVoteAgreeName
        "democratMvmv": [], //democratMembersVoteMissedValue
        "democratMvmn": [], //democratMembersVoteMissedName
        "democratMvpv": [], //democratMembersVoteParticipatedValue
        "democratMvpn": [], //democratMembersVoteParticipatedName
        "republicanMvdv": [], //republicanMembersVoteDisagreeValue
        "republicanMvdn": [], //republicanMembersVoteDisagreeName
        "republicanMvav": [], //republicanMembersVoteAgreeValue
        "republicanMvan": [], //republicanMembersVoteAgreeName
        "republicanMvmv": [], //republicanMembersVoteMissedValue
        "republicanMvmn": [], //republicanMembersVoteMissedName
        "republicanMvpv": [], //republicanMembersVoteParticipatedValue
        "republicanMvpn": [] //republicanMembersVoteParticipatedName
    };
    var democrats = [];
    var democratsVotes = [];
    var democratsMissed = [];
    var republicans = [];
    var republicansVotes = [];
    var republicansMissed = [];
    var independents = [];
    var independentsVotes = [];
    var democratAdder = 0;
    var republicanAdder = 0;
    var independentsAdder = 0;

    var i = 0; // counter
    var xd = 0,
        xr = 0,
        xi = 0; // democrat, republican and independent counters

    $.getJSON('http://api.nytimes.com/svc/politics/v3/us/legislative/congress/113/senate/members/current.json?api-key=ae7b114e37e2afebfc2e7565844c3486%3A1%3A74324197', function (data) {

        while (i < data.results[0].members.length) {

            if (data.results[0].members[i].party == "D") {
                democrats[xd] = data.results[0].members[i].first_name;
                democratsVotes[xd] = data.results[0].members[i].votes_with_party_pct;
                democratAdder += data.results[0].members[i].votes_with_party_pct;
                democratsMissed[xd] = data.results[0].members[i].missed_votes_pct;
                xd++;
            } else if (data.results[0].members[i].party == "R") {
                republicans[xr] = data.results[0].members[i].first_name;
                republicansVotes[xr] = data.results[0].members[i].votes_with_party_pct;
                republicanAdder += data.results[0].members[i].votes_with_party_pct;
                republicansMissed[xr] = data.results[0].members[i].missed_votes_pct;
                xr++;
            } else {
                independents[xi] = data.results[0].members[i].first_name;
                independentsVotes[xi] = data.results[0].members[i].votes_with_party_pct;
                xi++;
            }
            i++;

        }

        statistics.numberDemocrats = democrats.length;
        statistics.numberRepublicans = republicans.length;
        statistics.numberIndependents = independents.length;
        statistics.democratsAverage = parseFloat(parseFloat(democratAdder) / democrats.length).toFixed(2);
        statistics.republicansAverage = parseFloat(parseFloat(republicanAdder) / republicans.length).toFixed(2);


        /*    document.write("<br/>======================== Task 1: the number of Democrats, Republicans and Independents ");
                    document.write("<br/>Number Democrats: " + statistics.numberDemocrats);
                    document.write("<br/>Number Republicans:" + statistics.numberRepublicans);
                    document.write("<br/>Number Independents:" + statistics.numberIndependents);
        
                    document.write("<br/><br/><br/>======================== Task 2: how Democrats and Republicans compare, on average, for voting with their party");
        
                    document.write("<br/>Democrats: " + statistics.democratsAverage + " %");
                    document.write("<br/>Republicans:" + statistics.republicansAverage + " %");
        
                    document.write("<br/><br/><br/>======================== Task 3: which members most often do not vote with their party, which ones most often do vote with their party");*/

        // Democrats Do Not

        var aux = []; // array aux
        var aux2 = []; // used later
        var aux3 = []; //used later

        auxGenerator(aux, aux2, aux3, democratsVotes, democrats);

        aux.sort(); // aux arranged

        auxValueMin(democrats, aux, statistics.democratMvdv);

        auxOftenVote(aux2, aux3, statistics.democratMvdv, statistics.democratMvdn);

        /*    document.write("<br/>Democrat members most often do not vote with their party: " + statistics.democratMvdn);*/


        // Democrats Do

        var auxY2 = []; // used later
        var auxY3 = []; //used later

        auxGenerator(aux, auxY2, auxY3, democratsVotes, democrats);

        aux.sort();
        aux.reverse(); // aux rev arranged

        auxValueMax(democrats, aux, statistics.democratMvav);

        auxOftenVote(auxY2, auxY3, statistics.democratMvav, statistics.democratMvan);

        /*    document.write("<br/>Democrat members most often vote with their party: " + statistics.democratMvan);*/

        // Republicans

        // DO NOT

        var auxR = []; // array aux
        var auxR2 = []; // used later
        var auxR3 = []; //used later
        auxGenerator(auxR, auxR2, auxR3, republicansVotes, republicans);

        auxR.sort(); // auxR arranged
        auxValueMin(republicans, auxR, statistics.republicanMvdv);

        auxOftenVote(auxR2, auxR3, statistics.republicanMvdv, statistics.republicanMvdn);

        /*  document.write("<br/>Republican members most often do not vote with their party: " + statistics.republicanMvdn);*/

        // Republicans Do

        var auxRY2 = []; // used later
        var auxRY3 = []; //used later
        auxGenerator(auxR, auxRY2, auxRY3, republicansVotes, republicans);

        auxR.sort();
        auxR.reverse(); // auxR rev arranged
        auxValueMax(republicans, auxR, statistics.republicanMvav);

        auxOftenVote(auxRY2, auxRY3, statistics.republicanMvav, statistics.republicanMvan);

        /*    document.write("<br/>Republican members most often vote with their party: " + statistics.republicanMvan);*/

        /*document.write("<br/><br/><br/>======================== Task 4: which members have missed the most votes, which have missed the least");*/

        // Democrats Do Not Missed

        var auxDM = []; // array aux
        var auxDM2 = []; // used later
        var auxDM3 = []; //used later

        auxGenerator(auxDM, auxDM2, auxDM3, democratsMissed, democrats);

        auxDM.sort(); // aux arranged

        auxValueMin(democrats, auxDM, statistics.democratMvmv);

        auxOftenVote(auxDM2, auxDM3, statistics.democratMvmv, statistics.democratMvmn);

        /*    document.write("<br/>Democrat members have missed least votes: " + statistics.democratMvmn);*/

        // Democrats Do Missed

        var auxDMY2 = []; // used later
        var auxDMY3 = []; //used later

        auxGenerator(auxDM, auxDMY2, auxDMY3, democratsMissed, democrats);

        auxDM.sort();
        auxDM.reverse(); // aux rev arranged

        auxValueMax(democrats, auxDM, statistics.democratMvpv);

        auxOftenVote(auxDMY2, auxDMY3, statistics.democratMvpv, statistics.democratMvpn);

        /*    document.write("<br/>Democrat members have missed most votes: " + statistics.democratMvpn);*/

        // Republicans Do Not Missed

        var auxRM = []; // array aux
        var auxRM2 = []; // used later
        var auxRM3 = []; //used later

        auxGenerator(auxRM, auxRM2, auxRM3, republicansMissed, republicans);

        auxRM.sort(); // aux arranged

        auxValueMin(republicans, auxRM, statistics.republicanMvmv);

        auxOftenVote(auxRM2, auxRM3, statistics.republicanMvmv, statistics.republicanMvmn);

        /*    document.write("<br/>Republican members have missed least votes: " + statistics.republicanMvmn);*/


        // Republicans Do Missed

        var auxRMY2 = []; // used later
        var auxRMY3 = []; //used later

        auxGenerator(auxRM, auxRMY2, auxRMY3, republicansMissed, republicans);

        auxRM.sort();
        auxRM.reverse(); // aux rev arranged

        auxValueMax(republicans, auxRM, statistics.republicanMvpv);

        auxOftenVote(auxRMY2, auxRMY3, statistics.republicanMvpv, statistics.republicanMvpn);

        /*    document.write("<br/>Republican members have missed most votes: " + statistics.republicanMvpn);*/

        // ++++++++++++++++++++
        $("#numberDemocrat").html("Number of Democrats: " + statistics.numberDemocrats);
        $("#numberRepublican").html("Number of Republicans: " + statistics.numberRepublicans);
        $("#numberIndependent").html("Number of Independents: " + statistics.numberIndependents);
        $("#democratsAverage").html("Democrats Average: " + statistics.democratsAverage);
        $("#republicansAverage").html("Republicans Average: " + statistics.republicansAverage);

        var votesDisagree = "";

        //democrat
        var headerDMvd = "<tr><th colspan='2'>Member Vote Disagree</th></tr>";
        var tabMvd = tableGenerator(statistics.democratMvdn, statistics.democratMvdv, votesDisagree);
        $("#memberD-vote-disagree").html(headerDMvd + tabMvd);

        var headerDMva = "<tr><th colspan='2'>Member Vote Agree</th></tr>";
        var tabMva = tableGenerator(statistics.democratMvan, statistics.democratMvav, votesDisagree);
        $("#memberD-vote-agree").html(headerDMva + tabMva);

        var headerDMvm = "<tr><th colspan='2'>Member Vote Missed Most</th></tr>";
        var tabMvm = tableGenerator(statistics.democratMvmn, statistics.democratMvmv, votesDisagree);
        $("#memberD-vote-missed").html(headerDMvm + tabMvm);

        var headerDMvp = "<tr><th colspan='2'>Member Vote Missed Least</th></tr>";
        var tabMvp = tableGenerator(statistics.democratMvpn, statistics.democratMvpv, votesDisagree);
        $("#memberD-vote-participated").html(headerDMvp + tabMvp);

        //republican
        var headerRMvd = "<tr><th colspan='2'>Member Vote Disagree</th></tr>";
        var tabRMvd = tableGenerator(statistics.republicanMvdn, statistics.republicanMvdv, votesDisagree);
        $("#memberR-vote-disagree").html(headerRMvd + tabRMvd);

        var headerRMva = "<tr><th colspan='2'>Member Vote Agree</th></tr>";
        var tabRMva = tableGenerator(statistics.republicanMvan, statistics.republicanMvav, votesDisagree);
        $("#memberR-vote-agree").html(headerRMva + tabRMva);

        var headerRMvm = "<tr><th colspan='2'>Member Vote Missed Most</th></tr>";
        var tabRMvm = tableGenerator(statistics.republicanMvmn, statistics.republicanMvmv, votesDisagree);
        $("#memberR-vote-missed").html(headerRMvm + tabRMvm);

        var headerRMvp = "<tr><th colspan='2'>Member Vote Missed Least</th></tr>";
        var tabRMvp = tableGenerator(statistics.republicanMvpn, statistics.republicanMvpv, votesDisagree);
        $("#memberR-vote-participated").html(headerRMvp + tabRMvp);

    });
});
