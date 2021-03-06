var status = [0,0,0];

var tempdata = null;
var statusItemReport = [0,0,0,0];


function resetstatusD(data) { 
    status = [0,0,0];
    statusItemReport = [0,0,0,0];
};

function toggleDisplayD(id) {
    var el = document.getElementById(id);

    el.style.display = el.style.display === 'block' ? 'none' : 'block';

    return false;
};
// Method that checks that the browser supports the HTML5 File API
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
};

function uploadReport(evt) 
{
    //alert('upload action');
    if (!browserSupportFileUpload()) 
    {
        alert('The File APIs are not fully supported in this browser!');
    } 
    else 
    {
        var data = null;
        var file = evt;
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            var csvData = event.target.result;
            data = $.csv.toArrays(csvData);
            if (data && data.length > 0) {
                //alert('Imported -' + data.length + '- rows successfully from  '+ file.name);
                if(file.name.includes("SummaryReport"))
                {
                    
                    var html = generateTable(data);
                    incrementstatusD(data);
                    setupgraph1D(data);
                    $('#result2').empty();
                    $('#result2').html(html);
                    
                    //average throughput
                    $('#throughput').html(generateAvgThroughputD(data))
                }
                if(file.name.includes("ItemReport"))
                {
                    var html = generateTableD(data)
                    incrementstatusItemReportD(data);
                    setupitemReportD(data);
                    $('#result2').empty();
                    $('#result2').html(html);

                }
               
               
               
               
                ;
            } else {
                alert('No data to import!');
            }
        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
    }
    
};

var uploadFile = function(file, path) {
    alert('uploaded' +  path + "/" + file.name );
    // handle file uploading
    //alert('upload action');
    
        var dataupload = null;
        var fileupload = file.file[0];
        alert(fileupload);
        var reader = new FileReader();
        reader.readAsText(fileupload);
        
        reader.onload = function(event) {
        alert('Reading2');
            var csvData = event.target.result;
            dataupload = $.csv.toArrays(csvData);
            if (dataupload && dataupload.length > 0) {
                alert('Imported -' + dataupload.length + '- rows successfully!');
                var html = generateTable(dataupload);
                setupgraph1(dataupload);
                
                $('#result2').empty();
                $('#result2').html(html);
                
                //average throughput
                $('#throughput').html(generateAvgThroughput(dataupload));
            } else {
                alert('No data to import!');
            }
        };
        reader.onerror = function() {
            alert('Unable to read ' + fileupload.fileName);
        };
    };


// The event listener for the file upload
document.addEventListener('DOMContentLoaded', function(event) {
  
    /** Drag and Drop **/
    function dragHover(e) {
        e.stopPropagation();
        e.preventDefault();

        if (e.type === 'dragover') {
            e.target.className = 'over';
        } else {
            e.target.className = '';
        }
    }

    document.getElementById('dropDiv').addEventListener('dragover', dragHover);
    document.getElementById('dropDiv').addEventListener('dragleave', dragHover);

    document.getElementById('dropDiv').addEventListener('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();

        e.target.className = '';
       // alert("start loop ");
        

        var iterateFilesAndDirs = function(filesAndDirs, path) {
            for (var i = 0; i < filesAndDirs.length; i++) {
                //alert("start loop "+ filesAndDirs.length + " now at " + i);
                if (typeof filesAndDirs[i].getFilesAndDirectories === 'function') {
                    var path = filesAndDirs[i].path;
                    //alert("recusion"+ path + filesAndDirs[i]);
                    // this recursion enables deep traversal of directories
                    filesAndDirs[i].getFilesAndDirectories().then(function(subFilesAndDirs) {
                        // iterate through files and directories in sub-directory
                        iterateFilesAndDirs(subFilesAndDirs, path);
                        //alert("recusion"+ path);
                    });
                } else {
                    if(filesAndDirs[i].name.includes("SummaryReport"))
                    {
                    //alert("trying to upload"+ filesAndDirs[i]);    
                    uploadReport(filesAndDirs[i]);
                    }
                    if(filesAndDirs[i].name.includes("ItemReport"))
                    {
                    //alert("trying to upload"+ filesAndDirs[i]);    
                    //uploadFile(filesAndDirs[i], path);
                    uploadReport(filesAndDirs[i]);
                    }
                    
                    //alert("trying to upload"+ filesAndDirs[i]);
                }
            }
        };

        // begin by traversing the chosen files and directories
        if ('getFilesAndDirectories' in e.dataTransfer) {
                e.dataTransfer.getFilesAndDirectories().then(function(filesAndDirs) {
                //alert(filesAndDirs);
                iterateFilesAndDirs(filesAndDirs, '/');
                //alert("uploaded fully");
            });
        }
    });
});
 



function incrementstatusD(data) {

    for(var row in data) {
        
        if( data[row][2]== 'Failed')
         {
             status[2]++;
         }
         if(data[row][2]== 'In progress')
         {
             status[1]++ ;
         }
         if(data[row][2]== 'Completed')
         {
             status[0]++ ;
         }
}
};
function incrementstatusItemReportD(data) {

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
function setupitemReportD() {
    //variable for status Completed,In progress, Failed
    
   

        //html += '<tr>\r\n';
       // for(var item in data[row]) {
         // html += '<td>' + data[row][item] + '</td>\r\n';
        //}
        //html += '</tr>\r\n';
    
      //alert('successcount ' + status[0] + ' in progress '+ status[1] +' successcount '+ status[2]);
      var ctx2 = document.getElementById("ItemReportStatus").getContext('2d');
      var ItemREportStatus = new Chart(ctx2, {
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

function setupgraph1D() {
    //variable for status Completed,In progress, Failed
    
   

        //html += '<tr>\r\n';
       // for(var item in data[row]) {
         // html += '<td>' + data[row][item] + '</td>\r\n';
        //}
        //html += '</tr>\r\n';
    
      //alert('successcount ' + status[0] + ' in progress '+ status[1] +' successcount '+ status[2]);
      var ctx = document.getElementById("piechartStatus").getContext('2d');
      var piechartStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Completed", "In progress", "Failed"],
            datasets: [{
                label: "Status of Tasks",
                backgroundColor: ['#0078d4','#71afe5' ,'#a80000'],
                borderColor: ['#0078d4','#71afe5' ,'#a80000'],
                data: status,
            }]
        },
        options: {}
    });
      
      var ctx = document.getElementById("myChart").getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'horizontalBar',
      
          // The data for our dataset
          data: {
              labels: ["Completed", "In progress", "Failed"],
              datasets: [{
                  label: "Status of Tasks",
                  backgroundColor: '#0078d4',
                  borderColor: '#0078d4',
                  data: status,
              }]
          },
      
          // Configuration options go here
          options: {}
      });
      


};

//for building table
function generateTableD(data) {
    var html = '';
    if(typeof(data[0]) === 'undefined') {
      return null;
    }
    if(data[0].constructor === String) {
      html += '<tr>\r\n';
      for(var item in data) {
        html += '<td>' + data[item] + '</td>\r\n';
      }
      html += '</tr>\r\n';
    }
    if(data[0].constructor === Array) {
      for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
          html += '<td>' + data[row][item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
      }
    }
    if(data[0].constructor === Object) {
      for(var row in data) {
        html += '<tr>\r\n';
        for(var item in data[row]) {
          html += '<td>' + item + ':' + data[row][item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
      }
    };
    
    return html;
  };
  
function generateAvgThroughputD(data) {
    var html = '';
    if(typeof(data[0]) === 'undefined') {
        return null;
    }

    var total = 0.0;
    var tasks = 0;
    for (var i=1; i<data.length; i++) {
        if (data[i][2] == 'Completed') {
            total += parseFloat(data[i][16]);
            tasks++;
        }
    }

    var unit = "GB per hour";
    var avg = total / tasks;
    if (avg < 1) {
        avg *= 1000;
        unit = "MB per hour";
    }

    return("These " + tasks + " tasks averaged " + avg.toFixed(2) + unit);
};