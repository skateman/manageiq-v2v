import API, {
  globalMockMode,
  globalLocalStorageMode
} from '../../../../../../../../common/API';
import { POST_V2V_TRANSFORM_MAPPINGS } from './MappingWizardResultsStepConstants';
import { CONTINUE_TO_PLAN } from '../../../../OverviewConstants';
import { requestTransformationMappingsData } from './mappingWizardResultsStep.fixtures';
import { saveMappingToLocalStorage } from './saveMappings.localStorageService';

const mockMode = globalMockMode;
const localStorageMode = globalLocalStorageMode;

export const continueToPlanAction = id => dispatch => {
  dispatch({
    type: CONTINUE_TO_PLAN,
    payload: { id }
  });
};

const _postTransformMappingsActionCreator = (
  url,
  transformMappings
) => dispatch => {
  if (localStorageMode) {
    const result = saveMappingToLocalStorage(transformMappings);
    return dispatch({
      type: `${POST_V2V_TRANSFORM_MAPPINGS}_FULFILLED`,
      payload: { data: result }
    });
  }
  dispatch({
    type: POST_V2V_TRANSFORM_MAPPINGS,
    payload: new Promise((resolve, reject) => {
      API.post(url, transformMappings)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          if (mockMode) {
            return dispatch({
              type: `${POST_V2V_TRANSFORM_MAPPINGS}_FULFILLED`,
              payload: requestTransformationMappingsData.response
            });
          }
          return reject(e);
        });
    })
  });
};

export const postTransformMappingsAction = (url, transformMappings) =>
  _postTransformMappingsActionCreator(url, transformMappings);
