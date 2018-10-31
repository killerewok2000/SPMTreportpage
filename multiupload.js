function toggleDisplay(id) {
    var el = document.getElementById(id);

    el.style.display = el.style.display === 'block' ? 'none' : 'block';

    return false;
}

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

        var uploadFile = function(file, path) {
            alert('uploaded' +  path + "/" + file.value );
            // handle file uploading
        };

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
                    
                    uploadFile(filesAndDirs[i], path);
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