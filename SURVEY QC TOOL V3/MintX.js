$(document).ready(function(){
$("body").prepend('<textarea id="sandbox"></textarea><div id="sandbox1" contenteditable="true"></div>');
	$("#sandbox").css({height:'0px',width:'0px'});

$(document).on('dblclick',function()
	{
		chrome.extension.sendRequest({method: "getClipText"}, function(response) {
			var Dat = paste();
			doSearch(Dat);
		});
	});
});
function paste() {
    var result = '',
        sandbox = $('#sandbox').val('').select();
    if (document.execCommand('paste')) {
        result = $('#sandbox').val();
    }
    $('#sandbox').val('');
	return result;
}

function doSearch(RecText)
	{
		var NotFounds = [];
		var textGroup = RecText.split('\n');
		
		
		$("#NotFounds").dialog( "destroy" );
		if(textGroup.length > 0)
		{
			if($('#NotFounds').size() > 0)
			{
				$('#NotFounds').detach();
			}
		}
		document.designMode = "on";
		for(var i=0;i<textGroup.length;i++)
		{
			var text = textGroup[i].replace(/^\s+|(\s+(?!\S))/mg,"");
			if(text.length > 0)
			{
				text = text.replace(/^\s*$[\n\r]{1,}/gm, '');
				text = text.replace(/”/g, "\"");
				text = text.replace(/“/g, "\"");
				text = text.replace(/”/g, "\"");
				text = text.replace(/’/g, "\'");
				text = text.replace(/‘/g, "\'");
				text = text.replace(/–/g, "\-");
				text = text.replace(/—/g, "\-");
				text = text.replace(/–/g, "\-");
				text = text.replace(/…/g, "\...");
				var textbackup = text;
				if (window.find && window.getSelection)
				{
					 var sel = window.getSelection();
					 var seldummy = sel;
					 sel.collapse(document.body, 0);
					 document.body.offsetHeight;
					 if ( window.find(text,true) )
			     	 {
						 seldummy.collapse(document.body, 0);
						 while (window.find(text,true))
						 {							
							document.execCommand("hiliteColor", false, "#88E889");	
							seldummy.collapseToEnd();
						 }
					 }
					 else
					 {						
						NotFounds.push(text);
					 }
					 sel.collapseToEnd();
				}
				else if (document.body.createTextRange)
				{
					if ( window.find(text,false) )
			     	{
						NotFounds.push(text);
					}
					var textRange = document.body.createTextRange();
					while (textRange.findText(text))
					{
					   textRange.execCommand("hiliteColor", false, "#88E889");
					   textRange.collapse(false);
					}
				}
			}
		}
		document.designMode = "off";
		if(NotFounds.length > 0)
		{
			var st = "";
			for(var k=0;k<NotFounds.length;k++)
			{
				st = st + "<br><br><b>Mismatch "+ (k+1) + ":- <span style='color:red;'>" + NotFounds[k] + "</span></b>";
			}
			st = st + "";
			$('body').prepend('<div id="NotFounds" style="width:100%;" title="Mismatches Found"></div>');
			$('#NotFounds').html(st);
			
			//$('#NotFounds').css('display','none');
			
			//if( $( "#NotFounds" ).dialog( "isOpen" ) )
			//	$("#NotFounds").dialog( "destroy" );
			
			$( "#NotFounds" ).dialog({
				dialogClass: "no-close",
				width: 650,
				buttons: [
					{
						text: "OK",
						click: function() {
						$( this ).dialog( "close" );
					}
					}
				]
			});
		}
	}