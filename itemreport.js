//variable for status Migrated,In progress,Failed, Scan Finished
var statusItemReport = [0,0,0,0];

var tempdata = null;

function resetstatus(data) { 
    statusItemReport = [0,0,0,0];
};

$(document).ready(function() 
{

// The event listener for the file upload
document.getElementById('txtFileUpload2').addEventListener('change', upload, false);

// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
};

// Method that reads and processes the selected file
function upload(evt) 
{
    //alert('upload action');
    if (!browserSupportFileUpload()) 
    {
        alert('The File APIs are not fully supported in this browser!');
    } 
    else 
    {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;
            data = $.csv.toArrays(csvData);
            if (data && data.length > 0) {
                //alert('Imported -' + data.length + '- rows successfully!');
                if(file.fileName.includes("SummaryReport"))
                {
                //alert("trying to upload"+ filesAndDirs[i]);    
                uploadSummaryReport(filesAndDirs[i]);
                }
                if(file.fileName.includes("ItemReport"))
                {
                //alert("trying to upload"+ filesAndDirs[i]);    
                uploadFile(filesAndDirs[i], path);
                }




                incrementstatus(data);
                setupgraph1(data);
                $('#result2').empty();
                $('#result2').html(html);
                
                //average throughput
                $('#throughput').html(generateAvgThroughput(data));
            } else {
                alert('No data to import!');
            }
        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }
    
};
}); 


function incrementstatus(data) {

    for(var row in data) {
        
        if( data[row][6]== 'Failed')
         {
            statusItemReport[2]++;
         }
         if(data[row][6]== 'In progress')
         {
            statusItemReport[1]++ ;
         }
         if(data[row][6]== 'Migrated')
         {
            statusItemReport[0]++ ;
         }
         if(data[row][6]== 'Scan Finished')
         {
            statusItemReport[3]++ ;
         }
}
};





//function to setup graph of Status
function setupitemReport() {
    //variable for status Completed,In progress, Failed
    
   

        //html += '<tr>\r\n';
       // for(var item in data[row]) {
         // html += '<td>' + data[row][item] + '</td>\r\n';
        //}
        //html += '</tr>\r\n';
    
      //alert('successcount ' + status[0] + ' in progress '+ status[1] +' successcount '+ status[2]);
      var ctx = document.getElementById("ItemReportStatus").getContext('2d');
      var piechartStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Completed", "In progress", "Failed", "Scanned"],
            datasets: [{
                label: "Status of Tasks",
                backgroundColor: ['#0078d4','#71afe5' ,'#a80000','#71afe5'],
                borderColor: ['#0078d4','#71afe5' ,'#a80000', '#71afe5'],
                data: statusItemReport,
            }]
        },
        options: {}
    });
      
      
      


};

