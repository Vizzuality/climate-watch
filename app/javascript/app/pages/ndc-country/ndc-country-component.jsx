import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Header from 'components/header';
import Intro from 'components/intro';
import Button from 'components/button';
import BackButton from 'components/back-button';
import Search from 'components/search';
import cx from 'classnames';
import Sticky from 'react-stickynode';
import AnchorNav from 'components/anchor-nav';
import NdcsDocumentsMetaProvider from 'providers/ndcs-documents-meta-provider';
import Dropdown from 'components/dropdown';
import { Dropdown as CWDropdown } from 'cw-components';
import { NDC_COUNTRY } from 'data/SEO';
import { MetaDescription, SocialMetadata } from 'components/seo';
import { TabletLandscape } from 'components/responsive';

import anchorNavRegularTheme from 'styles/themes/anchor-nav/anchor-nav-regular.scss';
import dropdownLinksTheme from 'styles/themes/dropdown/dropdown-links.scss';
import countryDropdownTheme from 'styles/themes/dropdown/dropdown-country.scss';
import lightSearch from 'styles/themes/search/search-light.scss';
import styles from './ndc-country-styles.scss';

const FEATURE_LTS_EXPLORE = process.env.FEATURE_LTS_EXPLORE === 'true';

class NDCCountry extends PureComponent {
  renderFullTextDropdown() {
    const { match, documentsOptions, handleDropDownChange } = this.props;
    return (
      documentsOptions &&
      (documentsOptions.length > 1 ? (
        <Dropdown
          className={dropdownLinksTheme.dropdownOptionWithArrow}
          placeholder="View full text"
          options={documentsOptions}
          onValueChange={handleDropDownChange}
          white
          hideResetButton
        />
      ) : (
        <Button
          color="yellow"
          link={`/ndcs/country/${match.params.iso}/full`}
          className={styles.viewDocumentButton}
        >
          {`View ${documentsOptions[0].label} Document`}
        </Button>
      ))
    );
  }

  renderCompareButton() {
    const { match } = this.props;
    if (!FEATURE_LTS_EXPLORE) {
      return (
        <Button
          color="yellow"
          link={`/ndcs/compare/mitigation?locations=${match.params.iso}`}
        >
          {'Compare'}
        </Button>
      );
    }
    return (
      <div className={styles.compareButton}>
        <Button
          color="yellow"
          link={`/ndcs/compare/mitigation?locations=${match.params.iso}`}
        >
          {'Compare countries and submissions'}
        </Button>
      </div>
    );
  }

  render() {
    const {
      country,
      onSearchChange,
      search,
      route,
      anchorLinks,
      notSummary,
      location,
      countriesOptions,
      handleCountryLink
    } = this.props;

    const countryName = country && `${country.wri_standard_name}`;
    const hasSearch = notSummary;

    const renderIntroDropdown = () => (
      <Intro
        title={
          <CWDropdown
            value={
              country && {
                label: country.wri_standard_name,
                value: country.iso_code3
              }
            }
            options={countriesOptions}
            onValueChange={handleCountryLink}
            hideResetButton
            theme={countryDropdownTheme}
          />
        }
      />
    );

    return (
      <div>
        <MetaDescription
          descriptionContext={NDC_COUNTRY({ countryName })}
          subtitle={countryName}
        />
        <SocialMetadata
          descriptionContext={NDC_COUNTRY({ countryName })}
          href={location.href}
        />
        <NdcsDocumentsMetaProvider />
        {country && (
          <Header route={route}>
            <div className={styles.header}>
              <div
                className={cx(styles.actionsContainer, {
                  [styles.withSearch]: hasSearch || !FEATURE_LTS_EXPLORE,
                  [styles.withoutBack]: !FEATURE_LTS_EXPLORE
                })}
              >
                {!FEATURE_LTS_EXPLORE && renderIntroDropdown()}
                {FEATURE_LTS_EXPLORE && (
                  <BackButton
                    directLinksRegexs={[
                      { regex: /countries\/compare/, label: 'country compare' },
                      { regex: /countries/, label: 'country' }
                    ]}
                    clearRegexs={[/\/ndcs\/country/, /\/ndcs\/compare/]}
                  />
                )}
                {this.renderFullTextDropdown()}
                <TabletLandscape>
                  {!FEATURE_LTS_EXPLORE && this.renderCompareButton()}
                </TabletLandscape>
                {hasSearch && (
                  <Search
                    theme={lightSearch}
                    placeholder="Search"
                    value={search}
                    onChange={onSearchChange}
                  />
                )}
              </div>
              {FEATURE_LTS_EXPLORE && (
                <div className={styles.title}>{renderIntroDropdown()}</div>
              )}
              <TabletLandscape>
                {FEATURE_LTS_EXPLORE && this.renderCompareButton()}
              </TabletLandscape>
            </div>
            <Sticky activeClass="sticky -ndcs" top="#navBarMobile">
              <AnchorNav
                useRoutes
                links={anchorLinks}
                className={styles.anchorNav}
                theme={anchorNavRegularTheme}
                gradientColor={route.headerColor}
              />
            </Sticky>
          </Header>
        )}
        <div className={styles.wrapper}>{renderRoutes(route.routes)}</div>
      </div>
    );
  }
}

NDCCountry.propTypes = {
  route: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  country: PropTypes.object,
  onSearchChange: PropTypes.func.isRequired,
  handleCountryLink: PropTypes.func.isRequired,
  search: PropTypes.string,
  anchorLinks: PropTypes.array,
  documentsOptions: PropTypes.array,
  countriesOptions: PropTypes.array,
  handleDropDownChange: PropTypes.func,
  location: PropTypes.object,
  notSummary: PropTypes.bool
};

export default NDCCountry;
