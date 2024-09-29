var PAGE_LAST = '';
var POPSTATE_IGNORE = false;


$(function() {

	$('menu.toc a').on('click', function (e) {

		POPSTATE_IGNORE = true;
		e.preventDefault();

		document.location.hash = $(this).attr('href');
		PAGE_LAST = document.location.hash;

		page = $(this).attr('href');
		page = page.replace('#', '');
		page = page + '.html';




		$('menu.toc a').removeClass('active');
		$(this).addClass('active');


		$('.page').html('loading...').load('page/' + page, function () {

			uneeAnimatedObserve();
			POPSTATE_IGNORE = false;

			$('code.html').each(function () {

				str = $(this).html().trim();

				str = str.replaceAll('<', '[b]&lt;');
				str = str.replaceAll('>', '&gt;[/b]');
				str = str.replaceAll('[b]', '<b>');
				str = str.replaceAll('[/b]', '</b>');

				str = str.replaceAll('[[', '<b>&lt;');
				str = str.replaceAll(']]', '&gt;</b>');

				$(this).html(str);

			});


			// css variables
			$('.css-variables').html('loading variables...');

			$('.css-variables').hide();
			if(!$(this).find('.css-variables').length)
				return;


			$('.css-variables').show();
			patterns = $('.css-variables').data('pattern');
			patterns = patterns.replace(' ', '');
			patterns = patterns.split(',');


			const file = 'https://cdn.jsdelivr.net/gh/h2lsoft/unee-css/dist/unee.css';
			contents = $.get(file, function(contents){

				let rootBlocks = contents.match(/:root\s*{([^}]*)}/g);

				var variables = [];
				rootBlocks.forEach(function(block) {

					var innerContent = block.match(/{([^}]*)}/)[1];

					var lines = innerContent.split('\n')
						.map(function(line) { return line.trim(); })
						.filter(function(line) {
							return line.length > 0 && !line.startsWith('/*');
						});

					variables = variables.concat(lines);

					variables.sort(function(a, b) {
						return a.localeCompare(b, undefined, {sensitivity: 'base'});
					});


					let variables_html = '<div class="title">CSS VARIABLES</div>';

					// pattern
					var pattern_last = '';
					patterns.forEach(function(pattern) {
						pattern = pattern.trim();
						variables.forEach(function(line) {

							const p = line.split(':');
							let name = p[0].toString().trim();
							let val = p[1].toString().trim();
							val = val.replace(';', '');

							if(line.startsWith('--'+pattern+'-')) {

								if(pattern_last !== pattern)
								{
									pattern_last = pattern;
									variables_html += "<br>";
								}

								variables_html += "<b>"+name+":</b> ";
								variables_html += "<span>"+val+";</span>";
								variables_html += "<br>";
							}

						});

					});

					$('.css-variables').html(variables_html);

				});



			});



		});

	});

	const hash = document.location.hash;
	if(hash === '')
		$('menu.toc a:first').click();
	else
		$('menu.toc a[href="'+hash+'"]').click();

	$('body').on('click', 'input[name="extra_attribute"]', function(){

		const v = $(this).val();
		const parent_name = $(this).attr('name');

		$('form fieldset').attr('disabled', false)
						  .removeClass('is-invalid')
						  .removeClass('is-valid');


		$('form input, form select, form textarea').each(function(){

			if($(this).attr('name') === parent_name)return;

			/*
			if($(this).attr('type', 'button') === 'button' || $(this).attr('type', 'button') === 'reset' || $(this).attr('type', 'button') === 'submit')
				return;
			 */
			$(this).attr('disabled', false);
			$(this).removeClass('is-valid');
			$(this).removeClass('is-invalid');

			if(v === 'disabled')$(this).attr('disabled', true);
			if(v === 'valid')$(this).addClass('is-valid', 'valid');
			if(v === 'invalid')$(this).addClass('is-invalid', 'invalid');

			if($(this).parents('fieldset').length == 1)
			{
				if(v === 'disabled')
					$(this).parents('fieldset').attr('disabled', true);

				if(v === 'valid')
					$(this).parents('fieldset').addClass('is-valid');

				if(v === 'invalid')
					$(this).parents('fieldset').addClass('is-invalid');

			}


		});

	});


	// btn-loader
	$('body').on('click', '.btn-loader', function(){

		$('body').addClass('is-loading');
		setTimeout(() => $('body').removeClass('is-loading'), 3*1000);

	});



	// animated
	document.addEventListener('DOMContentLoaded', () => {
		uneeAnimatedObserve();
	});



	window.addEventListener('popstate', (event) => {

		if(POPSTATE_IGNORE)return;

		// anchor changes
		let hash = document.location.hash;
		$('menu.toc a[href="'+hash+'"]').click();

		const target_selector  = $('menu.toc a[href="' + hash + '"]');

		if(target_selector.length)
		{
			const target = $(target_selector);

			$('menu.toc').scrollTop((target.offset().top - 20));

		}




	});




});