var statusr = [0,0,0];

var tempdata = null;
var statusItemReport = [0,0,0,0];


function resetstatus(data) { 
    statusr = [0,0,0];
    statusItemReport = [0,0,0,0];
};

$(document).ready(function() 
{

    $(".summary").hide();
    $(".item").hide();
    
// The event listener for the file upload
document.getElementById('txtFileUpload').addEventListener('change', upload, false);

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
                var summaryContext = false;
                var itemContext = false;

                //alert('Imported -' + data.length + '- rows successfully from  '+ file.name);
                if(file.name.includes("SummaryReport"))
                {
                    
                    var html = generateTable(data);
                    incrementstatus(data);
                    tasksBySizeChart(data);
                    setupgraph1(data);
                    $('#result2').empty();
                    $('#result2').html(html);
                    
                    //average throughput
                    $('#throughput').html(generateAvgThroughput(data))

                    summaryContext = true;
                }
                if(file.name.includes("ItemReport"))
                {
                    var html = generateTable(data)
                    incrementstatusItemReport(data);
                    setupitemReport(data);
                    $('#result2').empty();
                    $('#result2').html(html);

                    itemContext = true;
                }
               
               setPageContext(summaryContext, itemContext);
               
               
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
}); 

function setPageContext(summaryContext, itemContext) {

    if(summaryContext) $(".summary").show();
    if(itemContext) $(".item").show();

}

function incrementstatus(data) {

    for(var row in data) {
        
        if( data[row][2]== 'Failed')
         {
            statusr[2]++;
         }
         if(data[row][2]== 'In progress')
         {
            statusr[1]++ ;
         }
         if(data[row][2]== 'Completed')
         {
            statusr[0]++ ;
         }
}
};
function incrementstatusItemReport(data) {

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

function tasksBySizeChart(data) {

    var data2 = data.slice(0);
    data2.sort(function(a,b){
        return b[4] - a[4];
    });

    var sizeData = [];
    sizeData[0] = [];
    sizeData[1] = []; 

    for(var row in data2) {
        if (row==0) continue;
        if (row>10) break;
        if (!sizeData[0][row]) sizeData[0][row] = 0;
        sizeData[0][row] += parseFloat(data2[row][4]);
        sizeData[1][row] = data2[row][0];
    }

    sizeData[0] = sizeData[0].slice(1);
    sizeData[1] = sizeData[1].slice(1);

    var ctx = document.getElementById("tasksBySize").getContext('2d');
      var chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'bar',
      
          // The data for our dataset
          data: {
              labels: sizeData[1],
                datasets: [{
                  label: "Task size (GB)",
                  backgroundColor: '#0078d4',
                  borderColor: '#0078d4',
                  data: sizeData[0],
              }]
          },
      
          // Configuration options go here
          options: {}
      });


}



//function to setup graph of Status
function setupitemReport() {
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

function setupgraph1() {
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
                data: statusr,
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
                  backgroundColor: ['#0078d4','#71afe5' ,'#a80000'],
                borderColor: ['#0078d4','#71afe5' ,'#a80000'],
                  data: statusr,
              }]
          },
      
          // Configuration options go here
          options: {}
      });
      

};

//for building table
function generateTable(data) {
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
  
function generateAvgThroughput(data) {
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

    var unit = "GB/h";
    var avg = total / tasks;
    if (avg < 1) {
        avg *= 1000;
        unit = "MB/h";
    }

    return(avg.toFixed(2) + unit);
};