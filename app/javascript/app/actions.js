import { actions as countriesProvider } from 'providers/countries-provider';
import { actions as regionsProvider } from 'providers/regions-provider';
import { actions as ndcsSdgsMetaProvider } from 'providers/ndcs-sdgs-meta-provider';
import { actions as geoLocationProvider } from 'providers/geolocation-provider';
import { actions as ghgEmissionsMetaProvider } from 'providers/ghg-emissions-meta-provider';
import { actions as wbCountryDataProvider } from 'providers/wb-country-data-provider';
import { actions as countrySelect } from 'components/countries-select';
import { actions as stories } from 'components/stories';
import { actions as autocompleteSearch } from 'components/autocomplete-search';
import { actions as ndcsAutocompleteSearch } from 'components/ndcs-autocomplete-search';
import { actions as mapActions } from 'components/map';
import { actions as modalMetadata } from 'components/modal-metadata';
import { actions as ghgEmissionsActions } from 'components/ghg-emissions';
import { actions as NDCSActions } from 'pages/ndcs';
import { actions as NDCCompareActions } from 'pages/ndc-compare';
import { actions as countryGhgEmissionsActions } from 'components/country-ghg-emissions';
import { actions as countryGhgEmissionsMapActions } from 'components/country-ghg-map';
import { actions as countryNDCOverviewActions } from 'components/country-ndc-overview';
import { actions as countrySDGLinkages } from 'components/country-ndc-sdg-linkages';
import { actions as countryNDCActions } from 'pages/ndc-country';
import { actions as countryNDCFullActions } from 'pages/ndc-country-full';
import { actions as ndcSearchActions } from 'pages/ndc-search';
import { actions as ndcSdgActions } from 'pages/ndc-sdg';

export default {
  ...countriesProvider,
  ...regionsProvider,
  ...ndcsSdgsMetaProvider,
  ...geoLocationProvider,
  ...ghgEmissionsMetaProvider,
  ...wbCountryDataProvider,
  ...stories,
  ...countrySelect,
  ...NDCSActions,
  ...NDCCompareActions,
  ...countryGhgEmissionsActions,
  ...countryGhgEmissionsMapActions,
  ...countrySDGLinkages,
  ...countryNDCActions,
  ...countryNDCFullActions,
  ...countryNDCOverviewActions,
  ...mapActions,
  ...modalMetadata,
  ...autocompleteSearch,
  ...ndcsAutocompleteSearch,
  ...ndcSearchActions,
  ...ghgEmissionsActions,
  ...ndcSdgActions
};