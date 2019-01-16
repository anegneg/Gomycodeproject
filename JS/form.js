

  
 



document.getElementById('tl_crpv_declaration_gp').addEventListener('submit', submitForm);

function submitForm(e){
    e.preventDefault();
    var civdec = getInputVal('opt_declarant_civilite_0');
    var civdec1 = getInputVal('opt_declarant_civilite_1');
    var namedec = getInputVal('ctrl_declarant_nom'); 
    var surnamedec = getInputVal('ctrl_declarant_prenom'); 
    var adressepostaledec = getInputVal('ctrl_declarant_adresse_postale');
    var villedec = getInputVal('ctrl_declarant_ville');
    var codepostaldec = getInputVal('ctrl_declarant_code_postal');
    var teldec = getInputVal('ctrl_declarant_telephone');
    var nompatient = getInputVal('ctrl_patient_nom');
    var medicamentnom = getInputVal('ctrl_nom_medicament[]');
    var piecejointe = getInputVal('ctrl_piece_jointe');

    
    send(civdec,
        civdec1,
        namedec,
        surnamedec,
        adressepostaledec,
        villedec,
        codepostaldec,
        teldec,
        nompatient,
        medicamentnom,
        piecejointe,
        )
    // Show alert
document.querySelector('.alert').style.display = 'block';
// Hide alert after 3 seconds
setTimeout(function(){
  document.querySelector('.alert').style.display = 'none';
},3000);

    document.getElementById('tl_crpv_declaration_gp').reset()

    console.log(namedec)
    console.log(codepostaldec)
}

function getInputVal(id){
    return document.getElementById(id).value;
  }

  var sarra = firebase.database().ref('Formulaire');

  function send(civdec,civdec1,namedec,surnamedec,adressepostaledec,
    villedec,codepostaldec,teldec,nompatient,medicamentnom,piecejointe,) {
      var declarant = sarra.push()
      declarant.set({
          civilitedec : civdec, 
          civilitedec1 : civdec1,
          declarant : namedec ,
          declarantP : surnamedec,
          adressedec : adressepostaledec,
          villedec : villedec,
          declarantCP : codepostaldec, 
          telephonedec : teldec,
          Nompatient : nompatient,
          Piece_jointe : piecejointe,
          Medicament_nom : medicamentnom,


      })
  }
  
  window.addEvent('domready', function() {
	
	// Initialize first element
	var accordion = $$('.accordionForm');
	tweenAccordion(accordion[0], false);
	initDatepicker($$('.datepicker'));
	accordion.each(function(el){
		checkNameDrug(el);
	});
	
	// Listener new drug
	$('addDrug').addEvent('click', function(event){
		event.preventDefault();
		console.log($('drugs').getElement('.removeDrug'));
		$('drugs').getElement('.removeDrug').removeClass('last');
		var arrDrugs = $$('.medicament');		
		var drugsNumber = arrDrugs.length;
		
		var cloned = arrDrugs[(drugsNumber - 1)];
		
		var clone = cloned.clone().inject(cloned, 'after');
		clone.set('id', 'drug_' + (drugsNumber + 1));
		clone.getElements('.togglerForm span').set('rel', 'Médicament ' + (drugsNumber + 1));
		clone.getElements('.togglerForm span').set('text', 'Médicament ' + (drugsNumber + 1));
		clone.getElements('input').each(function(el){
			el.set('value', '');
		});
		
		if(clone.getElement('select option'))
		{
			clone.getElement('select option').set('selected', 'selected');
			initChosen(arrDrugs);
		}
		
		tweenAccordion(clone.getFirst('.accordionForm'), false);
		initDatepicker(clone.getElements('.datepicker'));
	});
	
	// Listener remove drug
	$('drugs').addEvent('click:relay(.removeDrug)', function(event, el){
		event.preventDefault();
		var arrDrugs = $$('.medicament');
		if(arrDrugs.length > 1)
		{
			if(confirm('Voulez-vous vraiment supprimer ce médicament ?'))
			{
				el.getParent('.medicament').destroy();
				// Re-order info
				var arrDrugs = $$('.medicament');
				var i=1;
				arrDrugs.each(function(el){
					el.set('id', 'drug_' + i);
					el.getElements('.togglerForm span').set('rel', 'Médicament ' + (i));
					var str = el.getElements('.togglerForm span').get('text');
					var str = str + ''; // Force type string
					var regex = new RegExp("Médicament","g");
					if (str.match(regex))
					{
						el.getElements('.togglerForm span').set('text', 'Médicament ' + (i));
					}
					i++;
				});
				if(i == 2)
				{
					$('drugs').getElement('.removeDrug').addClass('last');
				}
			}
		}
		else
		{
			alert('Vous devez déclarer au moins un médicament');
		}
	});
	
	// Listener accordion
	$('drugs').addEvent('click:relay(.togglerForm)', function(event, el){
		var accordion = el.getNext('.accordionForm');
		tweenAccordion(accordion, true);
	});
	
	$('ctrl_submit').addEvent('click', function(event){
		event.preventDefault();
		var doNotSubmit = false;
		console.log(doNotSubmit);
		var arrDatepicker = $$('input.datepicker');
		var date_debut = '';
		var date_fin = '';
		arrDatepicker.each(function(el){
			var string = el.get('name');
			var value = el.get('value')
			
			var pattern_debut = new RegExp("(debut)", "g");
			var pattern_fin = new RegExp("(fin)", "g");
			
			if(string.match(pattern_debut) && value != '')
			{
				var value = value.split('/');
				date_debut = new Date(value[2], value[1], value[0]);
			}
			
			if(string.match(pattern_fin) && value != '' && date_debut != '')
			{
				var value = value.split('/');
				date_fin = new Date(value[2], value[1], value[0]);				
				if(date_debut > date_fin)
				{
					el.addClass('error');
					el.getPrevious().addClass('error');
					var pError  = new Element('p', {'class': 'error', html: 'La date de fin ne doit pas être supérieur à la date de début'});
					pError.inject(el, 'before');
					new Fx.Scroll(window).toElementCenter(pError, 'y');
					doNotSubmit = true;
				}				
				// Reset date_debut after test
				date_debut = '';
			}
		});
		console.log(doNotSubmit);
		if(!doNotSubmit)
		{
			document.forms.crpvForm.submit();
		}
	});
	
});

function tweenAccordion(elem, animate)
{
	var isOpen = false;
	if(elem.hasClass('open'))
	{
		var isOpen = true;
		elem.removeClass('open');
	}
	
	// Hide all opened accordionForm
	/*$$('.accordionForm.open').each(function(el){
		var myFx = new Fx.Reveal(el, {duration: 'short', transition: 'quad:out'});
		myFx.dissolve();
		el.removeClass('open')
	});*/
	
	// Tween the current clicked
	var myFx = new Fx.Reveal(elem, {duration: 'short', transition: 'quad:out'});
	if(isOpen && animate)
	{
		elem.getParent('.medicament').removeClass('open');
		elem.getParent('.medicament').addClass('close');
		myFx.dissolve();
	}
	else
	{
		elem.getParent('.medicament').removeClass('close');
		elem.getParent('.medicament').addClass('open');
		myFx.reveal();
		elem.addClass('open');
	}
	checkNameDrug(elem);
}

function initDatepicker(arrEl)
{
	var maxDate = new Date();
	maxDate = (maxDate.getMonth() + 1) + "/" + (maxDate.getDate() - 1) + "/" + maxDate.getFullYear();
	arrEl.each(function(el){
		new Picker.Date(el, {
			'pickerClass': 'datepicker_dashboard',
			'format': '%d/%m/%Y',
			'allowEmpty': true,
			'maxDate': maxDate,
			'positionOffset': {x:0,y:0},
			'blockKeydown': false,
		});
	});
}
function initChosen(arrElem)
{
	Stylect.convertSelects();	
	// Delete doublon
	arrElem.each(function(el){
		var i = 0;
		el.getElements('.styled_select').each(function(cel){
			if(i > 0)
			{
				cel.destroy()
			}
			i++
		});
	});
}
/*
 * Elem is accordionForm
 */
function checkNameDrug(elem)
{
	var nameDrug = elem.getElement('.autocompleterField').get('value');
	if(nameDrug != '')
	{
		elem.getPrevious('.togglerForm span').set('text', nameDrug);
	}
	else
	{
		elem.getPrevious('.togglerForm span').set('text', elem.getPrevious('.togglerForm span').get('rel'));
	}
}