angular
	.module('TousenApp')
	.service('CharacterService', CharacterService);

	CharacterService.$inject = ['CharacterDataService'];

function CharacterService(CharacterDataService){
    var minor = "Menor";
	var character = {
        LoadKinds: LoadKinds,
        LoadFamilies: LoadFamilies,
        GetMinors: GetMinors,
        LoadOrganizations: LoadOrganizations,
        FilterOrganizations: FilterOrganizations
	};

    function LoadKinds()
    {
        CharacterDataService.GetKinds()
            .success(_handlerKindSuccess)
            .error(_handlerError);
    }

    function LoadFamilies()
	{
	   CharacterDataService.GetFamilies()
		    .success(_handlerFamilySuccess)
			.error(_handlerError);
    }
    
    function GetMinors()
    {
        CharacterDataService.GetFamilies()
            .success(_handleMinors)
            .error(_handlerError);
    }

    function LoadOrganizations(character)
    {
        CharacterDataService.GetOrganizations()
            .success(_handleOrganizationsSuccess(character))
            .error(_handlerError);

    }

    function FilterOrganizations(character){
        var allOrganizations = this.GetOrganizations();
        var organizations = [];
        angular.forEach(allOrganizations, function(val) 
        {
            if (val.values.kinds == character.selectedRace.name) {
                if (val.values.families === undefined) {
                    organizations.push(val);
                } else {
                    if (_checkFamilies(val.values.families, character)){
                            organizations.push(val);
                    }
                }
            }
        });

        return organizations;
    }

    function _handlerKindSuccess(res) 
    {
        return  res.kinds;
    }

    function _handlerFamilySuccess(res) 
    {
        return res.Families;
    }

    function _handleMinors(res) 
    {
        return res.Families.find(a => a.Family === minor).advantages.med;
    }

    function _handleOrganizationsSuccess(res)
    {        
        return res.Organizations;
    }

    function _checkFamilies(fam, selected) 
    {
        return fam.indexOf(selected.selectedFatherFamily.Family) != -1 || fam.indexOf(selected.selectedMotherFamily.Family) != -1;
    }

    function _handlerError(data, status) 
    {
        console.log(data || "Request failed");
        console.log(status);
    }

	return character;
}
    