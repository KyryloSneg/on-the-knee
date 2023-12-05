import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import useDeviceSectionFetching from "../hooks/useDeviceSectionFetching";
import getTotalPages from "../utils/getTotalPages";
import DeviceList from "./DeviceList";
import "./styles/DeviceSection.css";
import ButtonPagination from "./UI/pagination/ButtonPagination";
import PagesPagination from "./UI/pagination/PagesPagination";
import { Spinner } from "react-bootstrap";
import isCanLoadMoreContent from "../utils/isCanLoadMoreContent";
import useGettingPaginationParams from "../hooks/useGettingPaginationParams";
import URLActions from "../utils/URLActions";

const DeviceSection = observer(() => {
  const { app, deviceStore } = useContext(Context);
  const deviceSectionRef = useRef(null);
  const totalPages = getTotalPages(deviceStore.totalCount, deviceStore.limit);
  const canLoadMore = isCanLoadMoreContent(
    deviceStore.totalCount,
    deviceStore.devices.length,
    (deviceStore.page - 1) * deviceStore._limit
  );

  const [minPrice, maxPrice] =
    URLActions.getParamValue("price")?.split("-").map(price => +price) || [];
  const [isLoading, error, fetching] = useDeviceSectionFetching(deviceStore, app, "", minPrice, maxPrice);
  if (error) console.log(error);

  useEffect(() => {
    app.setDeviceSectionRef(deviceSectionRef);
  }, [app, deviceStore.devices]);
  useGettingPaginationParams(deviceStore, totalPages);

  async function onFetchRetry() {
    // retrying latest fetch
    await fetching();
  }

  return (
    <main ref={deviceSectionRef}>
      {/* <DevicePageList /> */}
      {deviceStore.devices.length
        ? (
          <DeviceList
            devices={deviceStore.devices}
            stocks={deviceStore.stocks}
            sales={deviceStore.sales}
            saleTypeNames={deviceStore.saleTypeNames}
          />
        )
        : !error && (
          <p className="no-devices-message">
            We haven't found devices with such a filters {":("}
          </p>
        )
      }

      {/* spinner on "retry" fetch */}
      {(error && isLoading) &&
        <Spinner
          animation="border"
          variant="primary"
          size="sm"
          role="status"
          className="no-select error-retry-spinner"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      }
      {/* create "try again" btn */}
      {(!!error && !isLoading) &&
        <div className="device-section-error">
          <p>
            Oops! Something went wrong while getting devices.
          </p>
          <p>
            <button className="link-colors" onClick={onFetchRetry}>
              Try again
            </button> or visit our store later on.
          </p>
        </div>
      }
      {canLoadMore &&
        <ButtonPagination
          isLoading={isLoading}
        />
      }
      {(!canLoadMore && isLoading) &&
        <div className="visually-hidden" tabIndex={0} />
      }
      {!!(+deviceStore.totalCount) &&
        <PagesPagination
          totalPages={totalPages}
          currentPage={deviceStore.page}
          pagesToFetch={deviceStore.pagesToFetch}
          scrollElem={deviceSectionRef.current}
          ariaLabel="Device pages"
        />
      }
    </main>
  );
});

export default DeviceSection;
