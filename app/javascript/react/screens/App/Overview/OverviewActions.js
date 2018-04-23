import URI from 'urijs';

import API, {
  globalMockMode,
  globalLocalStorageMode
} from '../../../../common/API';

import {
  getLocalStorageState,
  LOCAL_STORAGE_KEYS
} from '../../../../common/LocalStorage';

import {
  SHOW_MAPPING_WIZARD,
  SHOW_PLAN_WIZARD,
  HIDE_MAPPING_WIZARD,
  FETCH_V2V_TRANSFORMATION_MAPPINGS,
  FETCH_V2V_TRANSFORMATION_PLANS,
  CREATE_V2V_TRANSFORMATION_PLAN_REQUEST,
  V2V_FETCH_CLUSTERS,
  V2V_SET_MIGRATIONS_FILTER
} from './OverviewConstants';

import {
  requestTransformationMappingsData,
  createTransformationPlanRequestData
} from './overview.fixtures';
import { requestTransformationPlansData } from './overview.transformationPlans.fixtures';
import { requestClustersData } from './overview.clusters.fixtures';

const mockMode = globalMockMode;
const localStorageMode = globalLocalStorageMode;

export const showMappingWizardAction = () => dispatch => {
  dispatch({
    type: SHOW_MAPPING_WIZARD
  });
};

export const showPlanWizardAction = id => dispatch => {
  dispatch({
    type: SHOW_PLAN_WIZARD,
    payload: id
  });
};

const _createTransformationPlanRequestActionCreator = url => dispatch =>
  dispatch({
    type: CREATE_V2V_TRANSFORMATION_PLAN_REQUEST,
    payload: {
      promise: API.post(url, { action: 'order' }),
      data: url
    }
  }).catch(error => {
    if (mockMode) {
      dispatch({
        type: `${CREATE_V2V_TRANSFORMATION_PLAN_REQUEST}_FULFILLED`,
        payload: createTransformationPlanRequestData.response
      });
    }
  });

export const createTransformationPlanRequestAction = url => {
  const uri = new URI(url);
  return _createTransformationPlanRequestActionCreator(uri.toString());
};

const _getTransformationMappingsActionCreator = url => dispatch => {
  if (localStorageMode) {
    const mappings = getLocalStorageState(
      LOCAL_STORAGE_KEYS.V2V_TRANSFORMATION_MAPPINGS
    );
    dispatch({
      type: `${FETCH_V2V_TRANSFORMATION_MAPPINGS}_FULFILLED`,
      payload: { data: { resources: mappings || [] } }
    });
  } else {
    dispatch({
      type: FETCH_V2V_TRANSFORMATION_MAPPINGS,
      payload: API.get(url)
    }).catch(error => {
      if (mockMode) {
        dispatch({
          type: `${FETCH_V2V_TRANSFORMATION_MAPPINGS}_FULFILLED`,
          payload: requestTransformationMappingsData.response
        });
      }
    });
  }
};

export const fetchTransformationMappingsAction = url => {
  const uri = new URI(url);
  return _getTransformationMappingsActionCreator(uri.toString());
};

const _getTransformationPlansActionCreator = url => dispatch => {
  if (localStorageMode) {
    dispatch({
      type: `${FETCH_V2V_TRANSFORMATION_PLANS}_FULFILLED`,
      payload: { data: { resources: [] } }
    });
  } else {
    dispatch({
      type: 'FETCH_V2V_TRANSFORMATION_PLANS',
      payload: API.get(url)
    }).catch(error => {
      if (mockMode) {
        dispatch({
          type: `${FETCH_V2V_TRANSFORMATION_PLANS}_FULFILLED`,
          payload: requestTransformationPlansData.response
        });
      }
    });
  }
};

export const fetchTransformationPlansAction = url => {
  const uri = new URI(url);
  return _getTransformationPlansActionCreator(uri.toString());
};

export const continueToPlanAction = id => dispatch => {
  dispatch({
    type: HIDE_MAPPING_WIZARD
  });
  dispatch({
    type: SHOW_PLAN_WIZARD,
    payload: { id }
  });
};

const _getClustersActionCreator = url => dispatch =>
  dispatch({
    type: `${V2V_FETCH_CLUSTERS}`,
    payload: API.get(url)
  }).catch(error => {
    if (mockMode) {
      dispatch({
        type: `${V2V_FETCH_CLUSTERS}_FULFILLED`,
        payload: requestClustersData.response
      });
    }
  });

export const fetchClustersAction = url => {
  const uri = new URI(url);
  return _getClustersActionCreator(uri.toString());
};

export const setMigrationsFilterAction = filter => ({
  type: V2V_SET_MIGRATIONS_FILTER,
  payload: filter
});
