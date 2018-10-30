$(document).ready(function() {
    /* $.ajax({
        type: "GET",
        url: "SampleCSV/SummaryReport.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
     */
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            /*var tarr;
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
            */

            var tarr = {
                source: data[0],
                dest: data[1],
                status: data[2],
                totalBytes: data[3],
                totalGB: data[4],
                migratedBytes: data[5],
                migratedGB: data[6],
                notMigratedGB: data[7],
                itemsScanned: data[8],
                itemsReady: data[9],
                itemsMigrated: data[10],
                itemsNotMigrated: data[11],
                warningCount: data[12],
                startTime: data[13],
                endTime: data[14],
                duration: data[15],
                transferRate: data[16],
                roundNumber: data[17],
                workflowId: data[18],
                taskId: data[19],
                logPath: data[20]
            };
            
        }
    }
    //alert(lines);
}