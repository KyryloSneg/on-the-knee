import "./styles/DeviceSection.css";
import { useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import getTotalPages from "../utils/getTotalPages";
import DeviceList from "./DeviceList";
import ButtonPagination from "./UI/pagination/ButtonPagination";
import PagesPagination from "./UI/pagination/PagesPagination";
import isCanLoadMoreContent from "../utils/isCanLoadMoreContent";
import useGettingPaginationParams from "../hooks/useGettingPaginationParams";
import Loader from "./UI/loader/Loader";
import DevicePageList from "./DevicePageList";

const DeviceSection = observer(({ isLoading, retryDevicesFetch, error, isInitialRenderRef }) => {
  const { app, deviceStore } = useContext(Context);
  const deviceSectionRef = useRef(null);
  const totalPages = getTotalPages(deviceStore.totalCount, deviceStore.limit);
  const canLoadMore = isCanLoadMoreContent(
    deviceStore.totalCount,
    deviceStore.devices.length,
    (deviceStore.page - 1) * deviceStore.limit
  );

  useEffect(() => {
    app.setDeviceSectionRef(deviceSectionRef);
  }, [app, deviceStore.devices]);
  useGettingPaginationParams(deviceStore, totalPages);

  async function onFetchRetry() {
    // retrying latest fetch
    await retryDevicesFetch();
  }

  return (
    <main className="device-section-main" ref={deviceSectionRef}>
      {deviceStore.devices.length
        ? <DevicePageList />
        : (!isInitialRenderRef.current && !error && !!Object.keys(deviceStore.usedFilters).length && !isLoading) && (
          <p className="no-devices-message">
            We haven't found devices with such filters {":("}
          </p>
        )
      }
      {/* spinner on "retry" fetch */}
      {(error && isLoading) &&
        <Loader className="error-retry-spinner" />
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
      {/* using "!!" to prevent "0" appearing instead of empty space */}
      {/* if there's more devices to load and devices are fetched */}
      {(!!canLoadMore && !!deviceStore.devices.length) &&
        <ButtonPagination
          isLoading={isLoading}
        />
      }
      {/* if devices are fetched and we've got totalCount (usually these conditions returns true at the same moment) */}
      {(!!(+deviceStore.totalCount) && !!deviceStore.devices.length) &&
        <PagesPagination
          totalPages={totalPages}
          currentPage={deviceStore.page}
          pagesToFetch={deviceStore.pagesToFetch}
          ariaLabel="Device pages"
        />
      }
    </main>
  );
});

export default DeviceSection;
