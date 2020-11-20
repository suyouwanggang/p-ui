import { OrganiazationNodeType } from '../components/organization-tree/index';

const orgiData:OrganiazationNodeType={key: '0',
    data: {roleName: 'EasyTrack'},styleClass:'p-person',
    collapsable:true,
    children: [
        {
            key: '0_0',
            data: {roleName:'CEO',userName: 'F.C. Barcelona'},
            collapsable:true,
            children: [
                {
                    data: {roleName:'CFO',userName: 'Chelsea F.C.'},styleClass:'p-person',
                    children:[
                        {
                            data:{roleName:'Tax',userName: 'F.C. Barcelona'},styleClass:'p-person'
                        },
                        {
                            data:{roleName:'Legal',userName: 'F.C. Barcelona'},styleClass:'p-person'
                        },
                        {
                            data:{roleName:'Operations',userName: 'F.C. Barcelona'},styleClass:'p-person'
                        }
                    ]
                },
                {
                    data: {roleName:'COO', userName:'F.C. Barcelona'},
                    children:[{
                        data:{roleName:'Operations'}

                    }]
                },
                {
                    data: {roleName:'CTO',userName: 'Jesse Pinkman'},children:[
                        {
                            data:{  roleName:'Development'},
                            children:[
                                {data:{roleName:'AnalySis'},styleClass:'p-person'},
                                {data:{roleName:'Front End'},styleClass:'p-person'},
                                {data:{roleName:'Back End'},styleClass:'p-person'}
                            ]
                        },
                        {
                            data:{  roleName:'QA'},children:[{data:{roleName:'B'}}]
                        },
                        {
                            data:{  roleName:'R&D'},
                        }
                    ]
                }
            ]
            
        },
        {
            key: '0_1',
            data: {roleName:'CEO 02',userName: 'F.C. Barcelona'},
        }
    ]
}
export default orgiData;