$('#category_new').submit(function(e)
{
	if($('#category').val().length == 0)
	{
		$('#error').html('Please Enter Category').addClass('alert alert-danger');
		e.preventDefault();
		return false;
	}
	
	return true;
});

$('#bookmark_form').submit(function(e)
{
	var pattern = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
	
	if($('#book_category').val().length == 0)
	{
		$('#error').html('Please Select Category').addClass('alert alert-danger');
		e.preventDefault();
		return false;
	}
	else if($('#name').val().length == 0)
	{
		$('#error').html('Please Enter Name').addClass('alert alert-danger');
		e.preventDefault();
		return false;
	}
	else if($('#url').val().length == 0)
	{
		$('#error').html('Please Enter URL').addClass('alert alert-danger');
		e.preventDefault();
		return false;
	}
	else if(! pattern.test($('#url').val()))
	{
		$('#error').html('Please Enter valid URL').addClass('alert alert-danger');
		e.preventDefault();
		return false;
	}
	
	return true;
});

