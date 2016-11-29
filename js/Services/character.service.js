angular
	.module('TousenApp')
	.service('CharacterService', CharacterService);

	CharacterService.$inject = ['CharacterDataService'];

function CharacterService(CharacterDataService){

	var character = {
        GetMinors: GetMinors,
        LoadFamilies: LoadFamilies,
        LoadKinds: LoadKinds,
        LoadOrganizations: LoadOrganizations,
        FilterOrganizations: FilterOrganizations
	};

     function LoadKinds()
    {
        CharacterDataService.GetKinds()
            .success(_handerKindsuccess)
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

    function _handerKindsuccess(res) 
    {
        return res.kinds;
    }

    function _handleMinors(res) 
    {
        return res.Families.find(a => a.Family === minor).advantages.med;
    }

    function _handleOrganizationsSuccess(res)
    {        
        return res.Organizations;
    }

    function _checkFamilies(fam, character) 
    {
        return fam.indexOf(character.selectedFatherFamily.Family) != -1 || fam.indexOf(character.selectedMotherFamily.Family) != -1;
    }

    function _handlerError(data, status) 
    {
        console.log(data || "Request failed");
        console.log(status);
    }

	return character;
}
    