// Stages that have been excluded from the aggregation pipeline query
__3tsoftwarelabs_disabled_aggregation_stages = [

	{
		// Stage 2 - excluded
		stage: 2,  source: {
			$match: {
			    // enter query here
			    
			}
		}
	},
]

db.getCollection("adoptees").aggregate(

	// Pipeline
	[
		// Stage 1
		{
			$project: {
			    // specifications
			    "firstName": 1,
			    "lastName": 1, 
			    "address.homeAddress": 1, 
			    "address.city": 1, 
			    "address.state": 1, 
			    "address.zip": 1,
			    "cell1Phone.name":1,
			    "cell1Phone.number":1,
			    "language":1,
			    "englishSpeaker":1,
			    "hasPersonalTransportation":1, 
			    "site": 1,
			    "specialNeeds": {
			        $reduce: {
			          input: "$criteria.specialNeeds",
			          initialValue: "",
			          in: {
			            "$cond": {
			              if: {
			                "$eq": [
			                  {
			                    "$indexOfArray": [
			                      "$criteria.specialNeeds",
			                      "$$this"
			                    ]
			                  },
			                  0
			                ]
			              },
			              then: {
			                "$concat": [
			                  "$$value",
			                  "$$this"
			                ]
			              },
			              else: {
			                "$concat": [
			                  "$$value",
			                  ",",
			                  "$$this"
			                ]
			              }
			            }
			          }
			        }
			     },
			    "additionalMembersCount": { $size: "$householdMembers" }
			}
		},

	]

	// Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/

);
