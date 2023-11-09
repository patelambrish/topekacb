// Requires official MongoShell 3.6+
use topekaCB;
db.getCollection("adoptees").aggregate(
    [
        { 
            "$project" : { 
                "_id" : NumberInt(0), 
                "a" : "$$ROOT"
            }
        }, 
        { 
            "$lookup" : { 
                "localField" : "a._adopterId", 
                "from" : "adopters", 
                "foreignField" : "_id", 
                "as" : "b"
            }
        }, 
        { 
            "$unwind" : { 
                "path" : "$b", 
                "preserveNullAndEmptyArrays" : true
            }
        }, 
        { 
            "$project" : { 
                "id" : 1.0, 
                "firstName" : "$a.firstName", 
                "lastName" : "$a.lastName", 
                "address" : "$a.address.homeAddress", 
                "city" : "$a.address.city", 
                "zip" : "$a.address.zip", 
                "cell1Phone-name" : "$a.cell1Phone.name", 
                "cell1Phone-number" : "$a.cell1Phone.number", 
                "cell2Phone-name" : "$a.cell2Phone.name", 
                "cell2Phone-number" : "$a.cell2Phone.number", 
                "language" : "$a.language", 
                "englishSpeaker" : "$a.englishSpeaker", 
                "hasPersonalTransportation" : "$a.hasPersonalTransportation", 
                "site" : "$a.site", 
                "familyMembersCount": { $cond: { if: { $isArray: "$a.householdMembers" }, then: { $size: "$a.householdMembers" }, else: "NA"} },
                "specialNeeds":{ $reduce: { input: '$a.criteria.specialNeeds', initialValue: '', in: { $concat: [ '$$value', {$cond: [{$eq: ['$$value', '']}, '', ', ']}, '$$this']}}},
                "email": "$a.email",
                "ssnLastFour": "$a.ssnLastFour",
                "adopterName" : "$b.name", 
                "_id" : NumberInt(0)
            }
        }
    ], 
    { 
        "allowDiskUse" : true
    }
);
