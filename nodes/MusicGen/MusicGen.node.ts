 import {IExecuteFunctions,} from 'n8n-core';

import {
	IDataObject,INodeExecutionData,INodeType,INodeTypeDescription,} from 'n8n-workflow';

// Main Class
export class MusicGen implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Music Generator',
      name: 'MusicGen',
      icon: 'file:exchangeRate.svg',
      group: ['input'],
      version: 1,
      description: 'Generate music from a prompt or melody',
      defaults: {
        name: 'MusicGen',
      },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [],
    properties: [
      {
        displayName: 'Model Type',
        name: 'ModelType',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'encode-decode',
            value: 'encode-decode',
            action: 'Campaigns',
          },
          {
            name: 'Large',
            value: 'large',
            action: 'Campaigns',
          },
          {
            name: 'melody-large',
            value: 'melody-large',
            action: 'Campaigns',
          },
          {
            name: 'stereo-melody',
            value: 'stereo-melody',
            action: 'Subscribers'
          },
          {
            name: 'stereo-melody-large',
            value: 'stereo-melody-large',
            action: 'Campaigns',
          },
          
        ],
        default:"stereo-melody-large"

      },
        {
          displayName: 'Prompt',
          name: 'prompt',
          type: 'string',
          noDataExpression: true,
          default:"",
          displayOptions: {
          },

        },{
          displayName: 'Duration',
          name: 'duration',
          type: "number",
          noDataExpression: true,
          default:"",
          displayOptions: {
          },

        }
      ],

    }
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {


        

        const items = this.getInputData();
        const length = items.length as number;
        const responseData: IDataObject[] = [];

        for (let i = 0; i < length; i++) {
            const ModelType = this.getNodeParameter('ModelType',i) as string;
            const prompt = this.getNodeParameter('prompt',i) as string;
            const duration = this.getNodeParameter('duration',i) as number;


            let Url = `http://127.0.0.1:8000/musicgen?model=${ModelType}&prompt=${prompt}&duration=${duration}`;
            console.log(Url);
            
            let response = await this.helpers.request({ method: 'GET', url: Url, json: true });
            let trace = response
            responseData.push({Url, trace})
        }

        return this.prepareOutputData(responseData.map((item) => ({ json: item })));
      }
    }
