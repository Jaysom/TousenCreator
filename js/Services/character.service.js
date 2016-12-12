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
        FilterOrganizations: FilterOrganizations,
        FilterClans: FilterClans,
        GetHonor: GetHonor,
        GetRichness: GetRichness
	};

    function LoadKinds()
    {
        return CharacterDataService.GetKinds()
            .catch(_handlerError);
    }

    function LoadFamilies()
	{
	   return CharacterDataService.GetFamilies()
			.catch(_handlerError);
    }
    
    function GetMinors()
    {
        return CharacterDataService.GetFamilies()
            .then(_handleMinors)
            .catch(_handlerError);
    }

    function FilterOrganizations(character, families)
    {
        var organizations = [];
        return CharacterDataService.GetOrganizations().then(function(data){
                return data.data.Organizations;
            }).then(function(allOrganizations){
                angular.forEach(allOrganizations, function(val) 
                {
                    if (val.values.kinds === character.name) {
                        if (val.values.families === undefined) {
                            organizations.push(val);
                        } else {
                            if (_checkFamilies(val.values.families, families)){
                                    organizations.push(val);
                            }
                        }
                    }
                });
            }).then(function(){
            return organizations;
        });        
    }

    function FilterClans(organization, families) 
    {
        var clans = []
        angular.forEach(organization.values.clans, function(vals,clan)
        {
            if (vals.Limit != null) {
                if (_checkFamilies(vals.Limit, families)) {
                        clans.push({clan,vals});
                    }	
            } else {
                clans.push({clan,vals});	
            }	
        });

        return clans
    }

    function GetHonor(honor, families) 
    {
        var a = Object.keys(honor);
        if (_checkFamilies(a, families)) {
            if (a.indexOf(families.father.Family) != -1) {
                return honor[families.father.Family]; 
            } else if (a.indexOf(families.mother.Family) != -1) {
                return honor[vm.families.fathermother.Family];
            }
        } else {
            return honor.Default;
        }
    }

    function GetRichness(richness, families)
    {
        var a = Object.keys(richness);
        if (_checkFamilies(a, families)) {
            if (a.indexOf(families.father.Family) != -1) {
                return rich[families.father.Family];
            } else if (a.indexOf(families.mother.Family) != -1) {
                return rich[families.mother.Family];
            }
        } else {
            return richness.Default;
        }
    }

    function _handleMinors(res) 
    {
        return res.data.families.find(a => a.Family === minor).advantages.med;
    }

    function _handleOrganizationsSuccess(res, character)
    {        
        return res.Organizations;
    }

    function _checkFamilies(fam, families) 
    {
        return fam.indexOf(families.father.Family) != -1 || fam.indexOf(families.mother.Family) != -1;
    }

    function _handlerError(data, status) 
    {
        console.log(data || "Request failed");
        console.log(status);
    }

	return character;
}
    